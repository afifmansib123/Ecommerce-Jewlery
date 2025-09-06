import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';
import Order from '@/lib/model/Order';
import Product from '@/lib/model/Product';

export async function POST(request: NextRequest) {
  try {
    const { items, cognitoId } = await request.json();
    
    if (!cognitoId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.connect();

    // Validate products (matching your cart items structure)
    const validatedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.id);
        
        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }

        if (!product.isActive || !product.isInStock || product.stockQuantity < item.quantity) {
          throw new Error(`${product.name} is not available`);
        }

        return {
          productId: product._id,
          name: product.name,
          price: product.discountedPrice || product.price,
          quantity: item.quantity,
          image: product.images[0] || item.image
        };
      })
    );

    const totalAmount = validatedItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    // Generate order number manually
    const timestamp = Date.now().toString().slice(-8);
    const randomNum = Math.floor(Math.random() * 899) + 100;
    const orderNumber = `ORD-${timestamp}-${randomNum}`;

    // Create pending order
    const order = new Order({
      cognitoId,
      items: validatedItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'card',
      orderNumber
    });

    await order.save();

    // Create Stripe session (Thai Baht only)
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : []
          },
          unit_amount: Math.round(item.price * 100), // Convert to satang (Thai Baht cents)
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        cognitoId,
      },
    });

    // Update order with session ID
    order.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      orderNumber: order.orderNumber
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' }, 
      { status: 500 }
    );
  }
}