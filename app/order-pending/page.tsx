'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Clock, MessageCircle, CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OrderDetails {
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const orderNumber = searchParams.get('orderNumber');

  // Replace with your actual LINE ID
  const LINE_ID = 'YOUR_LINE_ID';

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [orderNumber, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'THB') => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast.success('Order number copied!');
    }
  };

  const openLineChat = () => {
    if (orderDetails) {
      const lineMessage = encodeURIComponent(
        `🛒 Order Payment: ${orderDetails.orderNumber}\n💰 Total: ${formatPrice(orderDetails.totalAmount)}\n\nI have made the PromptPay payment. Please confirm.`
      );
      
      const lineUrl = `https://line.me/ti/p/${LINE_ID}?text=${lineMessage}`;
      window.open(lineUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12 text-orange-600" />
          </div>
          
          <h1 className="text-4xl font-light text-stone-900 mb-4">
            Payment Pending
          </h1>
          <p className="text-xl text-stone-600 font-light">
            Your order has been created. Please complete the PromptPay payment.
          </p>
        </motion.div>

        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-8"
          >
            {/* Order Details Card */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50/70 to-orange-100/70 border-b border-orange-200/50">
                <CardTitle className="text-2xl font-light text-stone-900 flex items-center justify-between">
                  <span>Order Details</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyOrderNumber}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Order #
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-stone-600">Order Number</p>
                      <p className="font-mono text-lg font-medium">{orderDetails.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-600">Total Amount</p>
                      <p className="text-2xl font-light text-stone-900">
                        {formatPrice(orderDetails.totalAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-stone-200 pt-4">
                    <h4 className="font-medium text-stone-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-light flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50/80 border border-green-200/50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-xs font-medium text-green-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Make PromptPay Payment</p>
                        <p className="text-sm text-stone-600">
                          Transfer <strong>{formatPrice(orderDetails.totalAmount)}</strong> via PromptPay to our account
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-xs font-medium text-green-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Contact Us on LINE</p>
                        <p className="text-sm text-stone-600">
                          Click the button below to chat with us and send payment confirmation
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-xs font-medium text-green-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Order Confirmation</p>
                        <p className="text-sm text-stone-600">
                          We'll confirm your payment and process your order within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={openLineChat}
                    className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-light tracking-wide py-4 text-lg"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Contact us on LINE
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-stone-600">
                      LINE ID: <span className="font-mono font-medium">@{LINE_ID}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-yellow-50/80 border border-yellow-200/50">
              <CardContent className="p-6">
                <h4 className="font-medium text-yellow-800 mb-3">Important Notes</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Please keep your payment receipt for verification</li>
                  <li>• Include your order number when contacting us</li>
                  <li>• Orders will be cancelled if not paid within 24 hours</li>
                  <li>• Contact us immediately if you encounter any issues</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 space-y-4"
        >
          <Button variant="ghost" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}