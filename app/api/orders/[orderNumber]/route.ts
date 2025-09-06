import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Order from '@/lib/model/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 });
    }

    await db.connect();

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      currency: order.currency,
      items: order.items,
      createdAt: order.createdAt,
      notes: order.notes
    });

  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

// PUT method to update order status (for manual confirmation)
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const { status, paymentStatus } = await request.json();

    await db.connect();

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { 
        status: status || 'confirmed',
        paymentStatus: paymentStatus || 'paid',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Order updated successfully',
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });

  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}