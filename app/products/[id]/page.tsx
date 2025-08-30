"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CheckCircle,
  XCircle,
  Gem,
  Crown,
  Scale,
  Award,
  X,
  Heart,
  Share2,
  ShoppingCart,
  Eye,
  Ruler,
  Calendar,
  Certificate,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Interfaces for antique jewelry
interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: { _id: string; name: string };
  price: number;
  discountedPrice?: number;
  currency: string;
  sku: string;
  images: string[];
  material?: string;
  period?: string;
  origin?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: "mm" | "cm" | "inches";
  };
  gemstones?: Array<{
    type: string;
    carat?: number;
    cut?: string;
    color?: string;
    clarity?: string;
  }>;
  condition: "excellent" | "very-good" | "good" | "fair" | "poor";
  authenticity: {
    certified: boolean;
    certificateNumber?: string;
    certifyingBody?: string;
  };
  stockQuantity: number;
  isInStock: boolean;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface QuantityModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

interface ImageLightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

// ImageLightbox component with enhanced styling
const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  startIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in-0 duration-300">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white hover:text-stone-300 z-10 p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-all border border-white/10"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-stone-300 z-10 p-4 rounded-xl bg-black/30 hover:bg-black/50 transition-all border border-white/10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-stone-300 z-10 p-4 rounded-xl bg-black/30 hover:bg-black/50 transition-all border border-white/10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-300">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${images.length}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          priority
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
        <span className="font-medium text-sm">{currentIndex + 1} / {images.length}</span>
      </div>
    </div>
  );
};

const QuantitySelectionModal: React.FC<QuantityModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();

  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stockQuantity, prev + change)));
  };

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

  const currentPrice = product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price
    ? product.discountedPrice
    : product.price;

  const totalPrice = currentPrice * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-200/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-stone-900 tracking-wide">Add to Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Product Summary */}
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-200">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-light text-lg text-stone-900 mb-2">{product.name}</h4>
              <p className="text-sm text-stone-600 mb-3">SKU: {product.sku}</p>
              <div className="mt-2">
                {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 line-through text-sm">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-red-600 font-medium">
                      {formatPrice(product.discountedPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-stone-800 font-medium">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-4">
            <label className="font-medium text-stone-900 text-sm tracking-wide">Quantity</label>
            <div className="flex items-center justify-between p-6 bg-stone-50/70 rounded-2xl border border-stone-200/50">
              <div className="flex items-center gap-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 p-0 rounded-xl border-stone-300 hover:bg-stone-100 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-light w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= product.stockQuantity}
                  className="w-10 h-10 p-0 rounded-xl border-stone-300 hover:bg-stone-100 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-stone-600 font-light">
                {product.stockQuantity} available
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-6 bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl border border-stone-200/50">
            <div className="flex justify-between items-center">
              <span className="font-medium text-stone-900 tracking-wide">Total:</span>
              <span className="text-2xl font-light text-stone-800">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-xl border-stone-300 hover:bg-stone-50 font-light tracking-wide"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(quantity)}
            className="bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-light tracking-wide shadow-lg hover:shadow-xl transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Product Detail Page Component
const ProductDetailView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addItem } = useCart();
  const { t, locale } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    if (!productId) {
      setError("Invalid Product ID.");
      setLoading(false);
      return;
    }
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/products/${productId}?populate=true`
        );
        if (!response.ok) throw new Error("Failed to fetch product details.");
        const data: Product = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  const openLightbox = (index: number) => {
    setLightboxStartIndex(index);
    setLightboxOpen(true);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to purchase products");
      return;
    }

    if (user.role !== "user") {
      toast.error("Only customers can purchase products");
      return;
    }

    if (!product?.isInStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    setShowQuantityModal(true);
  };

  const handleQuantityConfirm = (quantity: number) => {
    if (!product) return;

    const currentPrice = product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price
      ? product.discountedPrice
      : product.price;

    const cartItem = {
      id: product._id,
      name: product.name,
      price: currentPrice,
      originalPrice: product.price,
      discountedPrice: product.discountedPrice || null,
      quantity: quantity,
      image: product.images[0],
      sku: product.sku,
      currency: product.currency,
      productId: product._id,
    };

    addItem(cartItem as any);
    toast.success(`${product.name} added to cart!`);
    setShowQuantityModal(false);
  };

const formatPrice = (price: number, currency?: string) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
};

  const getConditionClass = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'very-good':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'good':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'fair':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'poor':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  const calculateSavings = () => {
    if (product?.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price) {
      const savings = product.price - product.discountedPrice;
      const percentage = Math.round((savings / product.price) * 100);
      return { amount: savings, percentage };
    }
    return null;
  };

  const formatDimensions = (dimensions: any) => {
    if (!dimensions) return null;
    const { length, width, height, unit } = dimensions;
    const parts = [];
    if (length) parts.push(`L: ${length}${unit}`);
    if (width) parts.push(`W: ${width}${unit}`);
    if (height) parts.push(`H: ${height}${unit}`);
    return parts.join(" × ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-stone-200 rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-stone-200 rounded-2xl h-96"></div>
                <div className="bg-stone-200 rounded-2xl h-64"></div>
              </div>
              <div className="bg-stone-200 rounded-2xl h-80"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-light text-red-600 mb-2">{t('tourDetail.error')}</h3>
          <p className="text-stone-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/products")} variant="outline" className="rounded-xl font-light">
            {t('tourDetail.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
        <div className="text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg max-w-md border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gem className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-light text-stone-600 mb-2">{t('tourDetail.notFound')}</h3>
          <p className="text-stone-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/products")} variant="outline" className="rounded-xl font-light">
            Browse All Products
          </Button>
        </div>
      </div>
    );
  }

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
      {/* Enhanced Header */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-stone-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/products")}
              className="inline-flex items-center text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition-all rounded-xl font-light tracking-wide"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> {t('tourDetail.back')}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-stone-50 transition-all">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-stone-50 transition-all">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Image Gallery */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-stone-100/50"
              variants={itemVariants}
            >
              <div className="relative h-[350px] sm:h-[450px] md:h-[550px] w-full group">
                {product.images && product.images.length > 0 ? (
                  <>
                    <button
                      onClick={() => openLightbox(lightboxStartIndex)}
                      className="w-full h-full"
                    >
                      <Image
                        src={product.images[lightboxStartIndex]}
                        alt={`${product.name} - Image ${lightboxStartIndex + 1}`}
                        layout="fill"
                        objectFit="cover"
                        priority={true}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxStartIndex(
                              (prev) => (prev - 1 + product.images.length) % product.images.length
                            );
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg border border-white/50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxStartIndex(
                              (prev) => (prev + 1) % product.images.length
                            );
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg border border-white/50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Stock Status Badge */}
                    <div className="absolute top-6 left-6">
                      {product.isInStock ? (
                        <Badge className="bg-green-50/90 text-green-800 border-green-200/50 backdrop-blur-sm font-light">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-50/90 text-red-800 border-red-200/50 backdrop-blur-sm font-light">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <div className="text-center">
                      <Gem className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                      <p className="text-stone-500 font-light">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="p-6 bg-stone-50/30">
                  <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setLightboxStartIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          index === lightboxStartIndex
                            ? "border-stone-400 scale-105 shadow-lg"
                            : "border-stone-200 hover:border-stone-300 hover:scale-105"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          width={80}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Enhanced Product Details */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-stone-100/50"
              variants={itemVariants}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100 font-light">
                      {product.category.name}
                    </Badge>
                    {product.isFeatured && (
                      <Badge className="bg-yellow-50 text-yellow-800 border-yellow-200 font-light">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {product.authenticity.certified && (
                      <Badge className="bg-green-50 text-green-800 border-green-200 font-light">
                        <Award className="w-3 h-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-light text-stone-900 mb-4 leading-tight tracking-wide">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 text-stone-600 mb-4">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-stone-500" />
                      <span className="text-sm font-light">SKU: {product.sku}</span>
                    </div>
                    {product.period && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                        <span className="text-sm font-light">{product.period}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Price Display */}
                <div className="text-center lg:text-right bg-gradient-to-br from-stone-50/70 to-stone-100/70 p-6 rounded-2xl border border-stone-200/50 lg:flex-shrink-0">
                  {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-lg text-stone-500 line-through font-light">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <Badge variant="destructive" className="text-xs font-light">
                          -{savings?.percentage}%
                        </Badge>
                      </div>
                      <div className="text-3xl font-light text-red-600">
                        {formatPrice(product.discountedPrice, product.currency)}
                      </div>
                      <div className="text-sm text-green-600 font-light bg-green-50 px-3 py-1 rounded-full">
                        Save {formatPrice(savings?.amount || 0, product.currency)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-light text-stone-700">
                      {formatPrice(product.price, product.currency)}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Product Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-stone-50/50 to-stone-100/50 rounded-2xl border border-stone-200/50">
                  <Crown className="w-8 h-8 text-stone-600 mx-auto mb-3" />
                  <div className="text-lg font-light text-stone-900 mb-1">
                    {product.material || "Various"}
                  </div>
                  <div className="text-sm text-stone-600 font-light">Material</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50/50 to-purple-100/50 rounded-2xl border border-purple-200/50">
                  <Scale className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className={`px-3 py-1 rounded-full text-sm font-light capitalize ${getConditionClass(product.condition)} mx-auto inline-block`}>
                    {product.condition.replace('-', ' ')}
                  </div>
                  <div className="text-sm text-stone-600 font-light mt-2">Condition</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50/50 to-blue-100/50 rounded-2xl border border-blue-200/50">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-lg font-light text-stone-900 mb-1">
                    {product.stockQuantity}
                  </div>
                  <div className="text-sm text-stone-600 font-light">Available</div>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-stone-100/70 p-1 rounded-xl">
                  <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="description" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="authenticity" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
                    Authenticity
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-8">
                  <div className="space-y-8">
                    <h4 className="font-light text-2xl text-stone-900 tracking-wide">Product Details</h4>

                    {product.shortDescription && (
                      <div className="p-6 bg-gradient-to-r from-stone-50/70 to-stone-100/70 rounded-xl border-l-4 border-stone-500">
                        <h5 className="font-medium text-stone-900 mb-3 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Quick Overview
                        </h5>
                        <p className="text-stone-800 leading-relaxed text-lg font-light">{product.shortDescription}</p>
                      </div>
                    )}

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h6 className="font-medium text-stone-900 flex items-center">
                          <Gem className="w-5 h-5 mr-2 text-purple-500" />
                          Basic Information
                        </h6>
                        <div className="space-y-3">
                          {product.origin && (
                            <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                              <span className="text-stone-600 font-light">Origin:</span>
                              <span className="font-light text-stone-900">{product.origin}</span>
                            </div>
                          )}
                          {product.period && (
                            <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                              <span className="text-stone-600 font-light">Period:</span>
                              <span className="font-light text-stone-900">{product.period}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                            <span className="text-stone-600 font-light">Condition:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-light capitalize ${getConditionClass(product.condition)}`}>
                              {product.condition.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                            <span className="text-stone-600 font-light">Stock:</span>
                            <span className="font-light text-stone-900">
                              {product.stockQuantity} {product.stockQuantity === 1 ? 'piece' : 'pieces'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h6 className="font-medium text-stone-900 flex items-center">
                          <Ruler className="w-5 h-5 mr-2 text-blue-500" />
                          Physical Properties
                        </h6>
                        <div className="space-y-3">
                          {product.weight && (
                            <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                              <span className="text-stone-600 font-light">Weight:</span>
                              <span className="font-light text-stone-900">{product.weight}g</span>
                            </div>
                          )}
                          {product.dimensions && formatDimensions(product.dimensions) && (
                            <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                              <span className="text-stone-600 font-light">Dimensions:</span>
                              <span className="font-light text-stone-900">{formatDimensions(product.dimensions)}</span>
                            </div>
                          )}
                          {product.material && (
                            <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                              <span className="text-stone-600 font-light">Material:</span>
                              <span className="font-light text-stone-900">{product.material}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gemstones Information */}
                    {product.gemstones && product.gemstones.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-xl text-stone-900 flex items-center">
                          <Gem className="w-6 h-6 mr-2 text-purple-500" />
                          Gemstones
                        </h5>
                        <div className="grid gap-4">
                          {product.gemstones.map((gemstone, index) => (
                            <div key={index} className="p-4 bg-purple-50/70 rounded-xl border border-purple-200/50 hover:bg-purple-100/70 transition-colors">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h6 className="font-medium text-purple-900 mb-2">{gemstone.type}</h6>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {gemstone.carat && (
                                      <div>
                                        <span className="text-stone-600 font-light">Carat: </span>
                                        <span className="font-light text-stone-900">{gemstone.carat}ct</span>
                                      </div>
                                    )}
                                    {gemstone.cut && (
                                      <div>
                                        <span className="text-stone-600 font-light">Cut: </span>
                                        <span className="font-light text-stone-900">{gemstone.cut}</span>
                                      </div>
                                    )}
                                    {gemstone.color && (
                                      <div>
                                        <span className="text-stone-600 font-light">Color: </span>
                                        <span className="font-light text-stone-900">{gemstone.color}</span>
                                      </div>
                                    )}
                                    {gemstone.clarity && (
                                      <div>
                                        <span className="text-stone-600 font-light">Clarity: </span>
                                        <span className="font-light text-stone-900">{gemstone.clarity}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Description Tab */}
                <TabsContent value="description" className="mt-8">
                  <div className="space-y-8">
                    <h4 className="font-light text-2xl text-stone-900 tracking-wide">Description</h4>

                    <div className="prose prose-lg max-w-none">
                      <div className="text-stone-700 leading-relaxed text-lg whitespace-pre-wrap bg-white/70 p-6 rounded-xl border border-stone-200/50 shadow-sm font-light">
                        {product.description || "No detailed description available for this product."}
                      </div>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-xl text-stone-900">Tags</h5>
                        <div className="flex flex-wrap gap-3">
                          {product.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-sm px-4 py-2 hover:bg-stone-50 hover:border-stone-300 transition-colors cursor-pointer font-light"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent value="specifications" className="mt-8">
                  <div className="space-y-8">
                    <h4 className="font-light text-2xl text-stone-900 tracking-wide">Specifications</h4>
                    
                    <div className="bg-white/70 rounded-xl border border-stone-200/50 overflow-hidden shadow-sm">
                      <div className="divide-y divide-stone-200/50">
                        <div className="p-6 bg-gradient-to-r from-stone-50/50 to-stone-100/50">
                          <h5 className="font-medium text-lg text-stone-900 mb-4">Product Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-stone-600 font-light">Product Name:</span>
                                <span className="font-light text-stone-900">{product.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-600 font-light">SKU:</span>
                                <span className="font-light text-stone-900 font-mono">{product.sku}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-600 font-light">Category:</span>
                                <span className="font-light text-stone-900">{product.category.name}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-stone-600 font-light">Stock Level:</span>
                                <span className={`font-light ${product.isInStock ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.isInStock ? `${product.stockQuantity} Available` : 'Out of Stock'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-600 font-light">Condition:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-light capitalize ${getConditionClass(product.condition)}`}>
                                  {product.condition.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(product.material || product.weight || product.dimensions) && (
                          <div className="p-6">
                            <h5 className="font-medium text-lg text-stone-900 mb-4">Physical Attributes</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {product.material && (
                                <div className="text-center p-4 bg-stone-50/50 rounded-lg border border-stone-200/50">
                                  <Crown className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                                  <div className="font-light text-stone-900">{product.material}</div>
                                  <div className="text-sm text-stone-600 font-light">Material</div>
                                </div>
                              )}
                              {product.weight && (
                                <div className="text-center p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
                                  <Scale className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                  <div className="font-light text-stone-900">{product.weight}g</div>
                                  <div className="text-sm text-stone-600 font-light">Weight</div>
                                </div>
                              )}
                              {product.dimensions && formatDimensions(product.dimensions) && (
                                <div className="text-center p-4 bg-green-50/50 rounded-lg border border-green-200/50">
                                  <Ruler className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                  <div className="font-light text-stone-900 text-sm">{formatDimensions(product.dimensions)}</div>
                                  <div className="text-sm text-stone-600 font-light">Size</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {(product.period || product.origin) && (
                          <div className="p-6 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
                            <h5 className="font-medium text-lg text-purple-900 mb-4">Historical Context</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {product.period && (
                                <div className="space-y-2">
                                  <span className="text-purple-700 font-light">Historical Period:</span>
                                  <div className="p-3 bg-white/70 rounded-lg border border-purple-200/50">
                                    <span className="font-light text-purple-900">{product.period}</span>
                                  </div>
                                </div>
                              )}
                              {product.origin && (
                                <div className="space-y-2">
                                  <span className="text-purple-700 font-light">Country of Origin:</span>
                                  <div className="p-3 bg-white/70 rounded-lg border border-purple-200/50">
                                    <span className="font-light text-purple-900">{product.origin}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Authenticity Tab */}
                <TabsContent value="authenticity" className="mt-8">
                  <div className="space-y-8">
                    <h4 className="font-light text-2xl text-stone-900 tracking-wide">Authenticity & Certification</h4>

                    <div className="p-6 bg-gradient-to-r from-green-50/70 to-emerald-50/70 rounded-xl border border-green-200/50">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          product.authenticity.certified 
                            ? 'bg-green-500' 
                            : 'bg-gray-400'
                        }`}>
                          {product.authenticity.certified ? (
                            <Award className="w-6 h-6 text-white" />
                          ) : (
                            <Certificate className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-xl text-green-900 mb-2">
                            {product.authenticity.certified ? 'Certified Authentic' : 'Authentication Pending'}
                          </h5>
                          <p className="text-green-800 leading-relaxed font-light">
                            {product.authenticity.certified 
                              ? 'This piece has been professionally authenticated and certified by experts.'
                              : 'This piece is being evaluated for authenticity certification.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {product.authenticity.certified && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.authenticity.certificateNumber && (
                          <div className="p-6 bg-white/70 rounded-xl border border-stone-200/50 shadow-sm">
                            <h6 className="font-medium text-stone-900 mb-3 flex items-center">
                              <Certificate className="w-5 h-5 mr-2 text-blue-500" />
                              Certificate Details
                            </h6>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-stone-600 font-light">Certificate #:</span>
                                <span className="font-light text-stone-900 font-mono">
                                  {product.authenticity.certificateNumber}
                                </span>
                              </div>
                              {product.authenticity.certifyingBody && (
                                <div className="flex justify-between">
                                  <span className="text-stone-600 font-light">Certified by:</span>
                                  <span className="font-light text-stone-900">
                                    {product.authenticity.certifyingBody}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="p-6 bg-white/70 rounded-xl border border-stone-200/50 shadow-sm">
                          <h6 className="font-medium text-stone-900 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            Authenticity Guarantee
                          </h6>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-light">Expert Authentication</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-light">Certificate of Authenticity</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-light">30-Day Return Policy</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-light">Lifetime Authenticity Guarantee</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!product.authenticity.certified && (
                      <div className="p-6 bg-gradient-to-r from-orange-50/70 to-yellow-50/70 rounded-xl border border-orange-200/50">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm font-light">!</span>
                          </div>
                          <div>
                            <h6 className="font-medium text-orange-900 mb-2">Authentication Note</h6>
                            <p className="text-sm text-orange-800 leading-relaxed font-light">
                              This piece is currently undergoing authentication processes. 
                              All purchases include a 30-day return policy if authenticity cannot be verified.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Enhanced Purchase Sidebar */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sticky top-32 border border-stone-100/50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-light text-stone-900 mb-2 tracking-wide">{t('tourDetail.ready')}</h3>
                <p className="text-stone-600 font-light">Add this unique piece to your collection</p>
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-stone-50/70 to-stone-100/70 rounded-xl border border-stone-200/50">
                {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                  <div className="text-center">
                    <div className="text-sm text-stone-500 line-through mb-1 font-light">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    <div className="text-2xl font-light text-red-600 mb-2">
                      {formatPrice(product.discountedPrice, product.currency)}
                    </div>
                    <Badge variant="destructive" className="text-xs font-light">
                      Save {savings?.percentage}% • {formatPrice(savings?.amount || 0, product.currency)}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-light text-stone-700">
                      {formatPrice(product.price, product.currency)}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.isInStock ? (
                  <div className="p-3 bg-green-50/70 rounded-lg border border-green-200/50">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-light">
                        {product.stockQuantity} {product.stockQuantity === 1 ? 'piece' : 'pieces'} available
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50/70 rounded-lg border border-red-200/50">
                    <div className="flex items-center justify-center gap-2 text-red-700">
                      <XCircle className="w-5 h-5" />
                      <span className="font-light">Currently Out of Stock</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white py-4 text-lg font-light rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 tracking-wide"
                  disabled={!user || user.role !== "user" || !product.isInStock}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {!user
                    ? "Login to Purchase"
                    : user.role !== "user"
                    ? "Customer Access Only"
                    : !product.isInStock
                    ? "Out of Stock"
                    : t('tourDetail.addToCart')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-4 text-lg font-light rounded-xl border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all duration-200 tracking-wide"
                  size="lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {t('tourDetail.askQuestion')}
                </Button>
              </div>

              <Separator className="my-6" />
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-light">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-light">{t('tourDetail.securePayments')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-light">30-Day Return Policy</span>
                </div>
              </div>
            </div>

            {/* Product Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-stone-100/50">
              <h4 className="font-medium text-lg text-stone-900 mb-4">Quick Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600 font-light">Category:</span>
                  <span className="font-light text-stone-900">{product.category.name}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-light">Material:</span>
                    <span className="font-light text-stone-900">{product.material}</span>
                  </div>
                )}
                {product.period && (
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-light">Period:</span>
                    <span className="font-light text-stone-900">{product.period}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-600 font-light">Condition:</span>
                  <span className={`px-2 py-1 rounded text-xs font-light capitalize ${getConditionClass(product.condition)}`}>
                    {product.condition.replace('-', ' ')}
                  </span>
                </div>
                {product.authenticity.certified && (
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-light">Certified:</span>
                    <span className="font-light text-green-600">
                      <Award className="w-4 h-4 inline mr-1" />
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-stone-100/50">
              <h4 className="font-medium text-lg text-stone-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Care Instructions
              </h4>
              <div className="space-y-3 text-sm text-stone-700">
                <div className="p-3 bg-stone-50/70 rounded-lg border border-stone-200/50">
                  <div className="font-light text-stone-900 mb-1">Storage</div>
                  <div className="text-stone-800 font-light">Keep in a cool, dry place away from direct sunlight</div>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200/50">
                  <div className="font-light text-blue-900 mb-1">Cleaning</div>
                  <div className="text-blue-800 font-light">Use soft cloth and appropriate jewelry cleaners only</div>
                </div>
                <div className="p-3 bg-green-50/70 rounded-lg border border-green-200/50">
                  <div className="font-light text-green-900 mb-1">Handling</div>
                  <div className="text-green-800 font-light">Handle with care to preserve historical integrity</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={product.images}
          startIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {showQuantityModal && (
        <QuantitySelectionModal
          product={product}
          isOpen={showQuantityModal}
          onClose={() => setShowQuantityModal(false)}
          onConfirm={handleQuantityConfirm}
        />
      )}
    </div>
  );
};

export default ProductDetailView;