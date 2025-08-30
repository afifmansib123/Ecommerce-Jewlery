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

const handleCheckout = async () => {
  if (!user) {
    toast.error(t('cart.signin.required'));
    router.push('/auth/signin');
    return;
  }

  // Debug log
  console.log('User object in checkout:', user);

  if (items.length === 0) {
    toast.error(t('cart.empty.title'));
    return;
  }

  setIsProcessing(true);
  
  try {
    // Try different possible field names for cognitoId
    // Cast user as any to bypass type checking:
const cognitoId = (user as any).cognitoId || (user as any).id || (user as any)._id || (user as any).userId;
    
    if (!cognitoId) {
      console.error('No cognitoId found in user object:', user);
      throw new Error('User identification missing');
    }

    console.log('Using cognitoId:', cognitoId);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        items,
        cognitoId
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Checkout API error:', data);
      throw new Error(data.error || 'Checkout failed');
    }

    // Redirect to Stripe
    const stripe = await import('@stripe/stripe-js').then(mod => 
      mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    );
    
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mb-12">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-20 h-20 text-stone-400" />
              </div>
              <div className="absolute -top-4 -right-8 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-red-600 text-lg font-light">0</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-light text-stone-900 mb-6 tracking-wide">
              {t("cart.empty.title")}
            </h2>
            <p className="text-stone-600 mb-12 text-lg leading-relaxed font-light max-w-md mx-auto">
              {t("cart.empty.subtitle")}
            </p>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-stone-800 hover:bg-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-light tracking-wide px-8 py-4 text-lg"
            >
              <Link href="/tours" className="inline-flex items-center">
                <ArrowLeft className="w-5 h-5 mr-3" />
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
      {/* Enhanced Header */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-stone-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-br from-stone-700 to-stone-900 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-stone-900 tracking-wide">
                  {t("cart.title")}
                </h1>
                <p className="text-stone-600 font-light">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your collection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/tours")} 
                className="text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition-all rounded-xl font-light tracking-wide"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-stone-50 transition-all">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Cart Items */}
          <div className="lg:col-span-2 space-y-6">
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
                      <div className="flex items-center">
                        <div className="relative overflow-hidden w-40 h-40 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          
                          {/* Item badges */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-stone-800 border-white/50 backdrop-blur-sm font-light">
                              Item #{index + 1}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-8">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-2xl font-light text-stone-900 mb-3 group-hover:text-stone-700 transition-colors duration-200 tracking-wide">
                                {item.name}
                              </h3>
                              
                              <div className="space-y-3">
                                <div className="flex items-baseline gap-3">
                                  <span className="text-3xl font-light text-stone-800">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="text-sm text-stone-600 font-light">
                                    {t("common.perPerson")}
                                  </span>
                                </div>
                                
                                {/* Enhanced booking details */}
                                <div className="flex flex-wrap gap-3">
                                  {(item as any).bookingDate && (
                                    <div className="flex items-center text-sm text-blue-700 bg-blue-50/80 px-4 py-2 rounded-xl border border-blue-200/50 font-light">
                                      <Calendar className="w-4 h-4 mr-2" />
                                      {new Date((item as any).bookingDate).toLocaleDateString()}
                                    </div>
                                  )}
                                  
                                  {(item as any).timeSlot && (
                                    <div className="flex items-center text-sm text-green-700 bg-green-50/80 px-4 py-2 rounded-xl border border-green-200/50 font-light">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {(item as any).timeSlot}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-6 ml-6">
                              {/* Enhanced Quantity Controls */}
                              <div className="flex items-center bg-stone-50/70 rounded-xl p-1 border border-stone-200/50 backdrop-blur-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-10 h-10 p-0 hover:bg-white rounded-lg transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center border-0 bg-transparent font-light text-lg"
                                  min="1"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-10 h-10 p-0 hover:bg-white rounded-lg transition-all"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Enhanced Price and Remove */}
                              <div className="text-right">
                                <p className="text-3xl font-light text-stone-900 mb-4">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all"
                                >
                                  <Trash2 className="h-5 w-5" />
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

            {/* Enhanced Booking Summary */}
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants}>
              <Card className="sticky top-32 bg-white/80 backdrop-blur-sm shadow-xl border border-stone-100/50">
                <CardHeader className="bg-gradient-to-r from-stone-50/70 to-stone-100/70 border-b border-stone-200/50">
                  <CardTitle className="text-2xl font-light text-stone-900 tracking-wide">
                    {t("cart.summary")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-light">{t("cart.subtotal")}</span>
                      <span className="font-light text-xl text-stone-900">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-light">{t("cart.serviceFee")}</span>
                      <span className="font-light text-green-600">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-light">{t("cart.taxes")}</span>
                      <span className="font-light">{formatPrice(Math.round(total * 0.01))}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 bg-gradient-to-r from-stone-50/70 to-stone-100/70 rounded-xl border border-stone-200/50">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-light text-stone-900 tracking-wide">{t("cart.total")}</span>
                        <span className="text-3xl font-light text-stone-800">{formatPrice(total + Math.round(total * 0.01))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {user ? (
                      <Button
                        className="w-full bg-stone-800 hover:bg-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-light tracking-wide py-4 text-lg"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={isProcessing}
                      >
                        <CreditCard className="h-5 w-5 mr-3" />
                        {isProcessing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                            {t("cart.processing")}
                          </div>
                        ) : (
                          t("cart.checkout")
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-yellow-50/80 border border-yellow-200/50 rounded-xl p-6 text-center backdrop-blur-sm">
                          <p className="text-sm text-yellow-800 font-light">
                            {t("cart.signin.required")}
                          </p>
                        </div>
                        <Button 
                          asChild 
                          className="w-full bg-stone-800 hover:bg-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-light tracking-wide py-4 text-lg" 
                          size="lg"
                        >
                          <Link href="/auth/signin">{t("nav.signin")}</Link>
                        </Button>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-stone-300 hover:border-stone-400 hover:bg-stone-50 transition-all duration-200 rounded-xl font-light tracking-wide py-4" 
                      asChild
                    >
                      <Link href="/tours" className="flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("cart.continue")}
                      </Link>
                    </Button>
                  </div>

                  <Separator />
                  
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-light">Secure Payments</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-light">Free Cancellation</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                      <CheckCircle className="w-4 h-4" />
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