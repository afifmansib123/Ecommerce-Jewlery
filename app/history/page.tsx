"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MapPin,
  Users,
  Phone,
  Mail,
  Share,
  MessageCircle,
  Printer  // Added this import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  cognitoId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'promptpay';
  currency: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        toast.error(data.error || 'Failed to fetch order details');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
          <span className="text-stone-600 font-light">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center p-8">
            <Package className="w-16 h-16 mx-auto text-stone-400 mb-4" />
            <h2 className="text-2xl font-light text-stone-900 mb-4">Order Not Found</h2>
            <p className="text-stone-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild className="w-full">
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
      {/* Header */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-stone-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-stone-700 to-stone-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-stone-900">Order #{order.orderNumber}</h1>
                  <p className="text-stone-600 font-light">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="rounded-xl">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light text-stone-900">Order Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(order.status)} font-light border text-base px-4 py-2`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </Badge>
                      <Badge className={`${getPaymentStatusColor(order.paymentStatus)} font-light border text-base px-4 py-2`}>
                        <span className="capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-600">Last Updated</p>
                      <p className="font-light text-stone-900">
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-stone-50/80 border border-stone-200/50 rounded-xl p-4">
                      <h4 className="font-medium text-stone-900 mb-2">Order Notes</h4>
                      <p className="text-stone-700 font-light">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light text-stone-900">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-stone-50/50 rounded-xl border border-stone-200/30">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-light text-stone-900 text-lg mb-1">{item.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-stone-600">
                          <span>Price: {formatPrice(item.price)}</span>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-light text-stone-900 text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light text-stone-900">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-stone-900">Order Placed</p>
                        <p className="text-sm text-stone-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {order.status === 'confirmed' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">Order Confirmed</p>
                          <p className="text-sm text-stone-600">
                            Your booking has been confirmed
                          </p>
                        </div>
                      </div>
                    )}

                    {order.paymentStatus === 'paid' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">Payment Received</p>
                          <p className="text-sm text-stone-600">
                            Payment processed successfully
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === 'completed' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">Order Completed</p>
                          <p className="text-sm text-stone-600">
                            Service delivered successfully
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">Order Cancelled</p>
                          <p className="text-sm text-stone-600">
                            This order has been cancelled
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light text-stone-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-stone-600 font-light">Subtotal</span>
                      <span className="font-light">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600 font-light">Service Fee</span>
                      <span className="font-light text-green-600">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600 font-light">Taxes (1%)</span>
                      <span className="font-light">{formatPrice(Math.round(order.totalAmount * 0.01))}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center bg-stone-50/80 p-3 rounded-xl">
                      <span className="text-lg font-light text-stone-900">Total</span>
                      <span className="text-xl font-light text-stone-900">
                        {formatPrice(order.totalAmount + Math.round(order.totalAmount * 0.01))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light text-stone-900">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-stone-600" />
                    <div>
                      <p className="font-light text-stone-900 capitalize">
                        {order.paymentMethod} Payment
                      </p>
                      <p className="text-sm text-stone-600">
                        {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'PromptPay via LINE'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-stone-50/80 border border-stone-200/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">Payment Status</span>
                      <Badge className={`${getPaymentStatusColor(order.paymentStatus)} font-light border`}>
                        <span className="capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </div>
                  </div>

                  {order.paymentStatus === 'pending' && order.paymentMethod === 'promptpay' && (
                    <div className="bg-yellow-50/80 border border-yellow-200/50 rounded-xl p-4">
                      <p className="text-sm text-yellow-800 font-light">
                        Please send your payment confirmation via LINE chat to complete the order.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light text-stone-900">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-stone-600 font-light text-sm">
                    Have questions about your order? Our support team is here to help.
                  </p>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      <Phone className="w-4 h-4 mr-3" />
                      Call Support
                    </Button>
                    
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      <Mail className="w-4 h-4 mr-3" />
                      Email Support
                    </Button>
                    
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
                <CardContent className="p-6 space-y-3">
                  {order.status === 'pending' && (
                    <Button 
                      variant="destructive" 
                      className="w-full rounded-xl"
                      onClick={() => {
                        toast.info('Contact support to cancel your order');
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Request Cancellation
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl"
                    asChild
                  >
                    <Link href="/tours">
                      <Package className="w-4 h-4 mr-2" />
                      Browse More Tours
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}