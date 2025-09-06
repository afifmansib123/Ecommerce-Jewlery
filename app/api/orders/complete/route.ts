import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';
import Order from '@/lib/model/Order';

export async function POST(request: NextRequest) {
  try {
    const { session_id, order_id } = await request.json();

    if (!session_id || !order_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await db.connect();

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(
      order_id,
      {
        status: 'confirmed',
        paymentStatus: 'paid',
        stripePaymentIntentId: session.payment_intent,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order completed successfully',
      orderNumber: order.orderNumber
    });

  } catch (error: any) {
    console.error('Error completing order:', error);
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    );
  }
}