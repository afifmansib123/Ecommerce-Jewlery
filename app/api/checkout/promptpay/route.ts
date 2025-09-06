import { NextRequest, NextResponse } from 'next/server';
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

    // Create pending order for PromptPay
    const order = new Order({
      cognitoId,
      items: validatedItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'promptpay',
      notes: 'PromptPay payment - awaiting confirmation',
      orderNumber
    });

    await order.save();

    return NextResponse.json({ 
      orderNumber: order.orderNumber,
      totalAmount: totalAmount,
      orderId: order._id
    });

  } catch (error: any) {
    console.error('PromptPay checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' }, 
      { status: 500 }
    );
  }
}