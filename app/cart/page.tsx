"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, CreditCard, ShoppingBag, Calendar, Clock, Users, ArrowLeft, Heart, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

const handleCheckout = async (paymentMethod: 'card' | 'promptpay') => {
  if (!user) {
    toast.error(t('cart.signin.required'));
    router.push('/auth/signin');
    return;
  }

  if (items.length === 0) {
    toast.error(t('cart.empty.title'));
    return;
  }

  setIsProcessing(true);
  
  try {
    const cognitoId = (user as any).cognitoId || (user as any).id || (user as any)._id || (user as any).userId;
    
    if (!cognitoId) {
      throw new Error('User identification missing');
    }

    // Transform cart items
    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    if (paymentMethod === 'card') {
      // Handle Stripe checkout
      const response = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: orderItems,
          cognitoId
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe
      const stripe = await import('@stripe/stripe-js').then(mod => 
        mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      );
      
      if (stripe) {
        clearCart();
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
      
    } else if (paymentMethod === 'promptpay') {
      // Handle PromptPay (LINE chat)
      const response = await fetch('/api/checkout/promptpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: orderItems,
          cognitoId
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      clearCart();
      
      // Redirect to LINE chat with order details
      const lineMessage = encodeURIComponent(
        `🛒 New Order: ${data.orderNumber}\n💰 Total: ${formatPrice(total + Math.round(total * 0.01))}\n📦 ${items.length} items\n\nPlease send PromptPay payment confirmation.`
      );
      
      const lineUrl = `https://line.me/ti/p/YOUR_LINE_ID?text=${lineMessage}`;
      window.open(lineUrl, '_blank');
      
      // Redirect to pending order page
      router.push(`/order-pending?orderNumber=${data.orderNumber}`);
    }
    
  } catch (error: any) {
    console.error('Checkout error:', error);
    toast.error(error.message || 'Checkout failed');
  } finally {
    setIsProcessing(false);
  }
};

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mb-8 sm:mb-12">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-stone-400" />
              </div>
              <div className="absolute -top-2 -right-4 sm:-top-4 sm:-right-8 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-red-600 text-base sm:text-lg font-light">0</span>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-light text-stone-900 mb-4 sm:mb-6 tracking-wide px-4">
              {t("cart.empty.title")}
            </h2>
            <p className="text-stone-600 mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed font-light max-w-md mx-auto px-4">
              {t("cart.empty.subtitle")}
            </p>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-stone-800 hover:bg-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-light tracking-wide px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Link href="/tours" className="inline-flex items-center">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                {t("cart.empty.browse")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
      {/* Enhanced Header - Mobile Optimized */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-stone-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-light text-stone-900 tracking-wide truncate">
                  {t("cart.title")}
                </h1>
                <p className="text-sm sm:text-base text-stone-600 font-light">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/tours")} 
                className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition-all rounded-xl font-light tracking-wide p-2 sm:px-4"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Continue Shopping</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-stone-50 transition-all p-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Cart Items - Mobile Optimized */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Mobile: Stack vertically, Desktop: Side by side */}
                      <div className="flex flex-col sm:flex-row items-stretch">
                        <div className="relative overflow-hidden w-full h-48 sm:w-40 sm:h-40 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          
                          {/* Item badges */}
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                            <Badge className="bg-white/90 text-stone-800 border-white/50 backdrop-blur-sm font-light text-xs">
                              Item #{index + 1}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-4 sm:p-8">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-2xl font-light text-stone-900 mb-2 sm:mb-3 group-hover:text-stone-700 transition-colors duration-200 tracking-wide line-clamp-2">
                                {item.name}
                              </h3>
                              
                              <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-baseline gap-2 sm:gap-3">
                                  <span className="text-xl sm:text-3xl font-light text-stone-800">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="text-xs sm:text-sm text-stone-600 font-light">
                                    {t("common.perPerson")}
                                  </span>
                                </div>
                                
                                {/* Enhanced booking details - Mobile optimized */}
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                  {(item as any).bookingDate && (
                                    <div className="flex items-center text-xs sm:text-sm text-blue-700 bg-blue-50/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-blue-200/50 font-light">
                                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                      <span className="truncate">{new Date((item as any).bookingDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  
                                  {(item as any).timeSlot && (
                                    <div className="flex items-center text-xs sm:text-sm text-green-700 bg-green-50/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-green-200/50 font-light">
                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                      <span className="truncate">{(item as any).timeSlot}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Mobile: Row layout, Desktop: Column layout */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:space-y-6 gap-4 sm:ml-6">
                              {/* Enhanced Quantity Controls */}
                              <div className="flex items-center bg-stone-50/70 rounded-lg sm:rounded-xl p-1 border border-stone-200/50 backdrop-blur-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 sm:w-10 sm:h-10 p-0 hover:bg-white rounded-md sm:rounded-lg transition-all"
                                >
                                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="w-12 sm:w-16 text-center border-0 bg-transparent font-light text-base sm:text-lg"
                                  min="1"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 sm:w-10 sm:h-10 p-0 hover:bg-white rounded-md sm:rounded-lg transition-all"
                                >
                                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>

                              {/* Enhanced Price and Remove */}
                              <div className="text-right flex sm:flex-col items-center gap-2 sm:gap-4">
                                <p className="text-lg sm:text-3xl font-light text-stone-900">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all"
                                >
                                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Enhanced Order Summary - Mobile Optimized */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants}>
              <Card className="lg:sticky lg:top-32 bg-white/80 backdrop-blur-sm shadow-xl border border-stone-100/50">
                <CardHeader className="bg-gradient-to-r from-stone-50/70 to-stone-100/70 border-b border-stone-200/50 px-4 sm:px-6 py-4 sm:py-6">
                  <CardTitle className="text-xl sm:text-2xl font-light text-stone-900 tracking-wide">
                    {t("cart.summary")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-stone-600 font-light">{t("cart.subtotal")}</span>
                      <span className="font-light text-lg sm:text-xl text-stone-900">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-stone-600 font-light">{t("cart.serviceFee")}</span>
                      <span className="font-light text-green-600 text-sm sm:text-base">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-stone-600 font-light">{t("cart.taxes")}</span>
                      <span className="font-light text-sm sm:text-base">{formatPrice(Math.round(total * 0.01))}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-stone-50/70 to-stone-100/70 rounded-lg sm:rounded-xl border border-stone-200/50">
                      <div className="flex justify-between items-center">
                        <span className="text-lg sm:text-2xl font-light text-stone-900 tracking-wide">{t("cart.total")}</span>
                        <span className="text-xl sm:text-3xl font-light text-stone-800">{formatPrice(total + Math.round(total * 0.01))}</span>
                      </div>
                    </div>
                  </div>

<div className="space-y-3 sm:space-y-4">
                    {user ? (
                      <div className="space-y-3">
                        {/* Credit/Debit Card Payment */}
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg sm:rounded-xl font-light tracking-wide py-3 sm:py-4 text-base sm:text-lg"
                          size="lg"
                          onClick={() => handleCheckout('card')}
                          disabled={isProcessing}
                        >
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          {isProcessing ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2 sm:mr-3"></div>
                              Processing...
                            </div>
                          ) : (
                            'Pay with Card'
                          )}
                        </Button>

                        {/* PromptPay Payment */}
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg sm:rounded-xl font-light tracking-wide py-3 sm:py-4 text-base sm:text-lg"
                          size="lg"
                          onClick={() => handleCheckout('promptpay')}
                          disabled={isProcessing}
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Pay with PromptPay
                        </Button>

                        {/* Payment Methods Info */}
                        <div className="bg-stone-50/80 border border-stone-200/50 rounded-lg p-3 text-center backdrop-blur-sm">
                          <p className="text-xs text-stone-600 font-light">
                            💳 Secure card payments via Stripe<br/>
                            📱 PromptPay via LINE chat
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-yellow-50/80 border border-yellow-200/50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm">
                          <p className="text-xs sm:text-sm text-yellow-800 font-light">
                            {t("cart.signin.required")}
                          </p>
                        </div>
                        <Button 
                          asChild 
                          className="w-full bg-stone-800 hover:bg-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl font-light tracking-wide py-3 sm:py-4 text-base sm:text-lg" 
                          size="lg"
                        >
                          <Link href="/auth/signin">{t("nav.signin")}</Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />
                  
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-green-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-light">Secure Payments</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-light">Free Cancellation</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-light">24/7 Customer Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}