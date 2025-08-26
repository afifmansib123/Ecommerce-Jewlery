// app/products/[id]/page.tsx

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
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all"
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="font-medium">{currentIndex + 1} / {images.length}</span>
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency,
    }).format(price);
  };

  const currentPrice = product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price
    ? product.discountedPrice
    : product.price;

  const totalPrice = currentPrice * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add to Cart</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Summary */}
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              <div className="mt-1">
                {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 line-through text-sm">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-red-600 font-bold">
                      {formatPrice(product.discountedPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-blue-600 font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="font-semibold text-gray-900">Quantity</label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= product.stockQuantity}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {product.stockQuantity} available
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(quantity)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
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

  const formatPrice = (price: number, currency: string) => {
    const priceLocale =
      locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : "en-US";
    return new Intl.NumberFormat(priceLocale, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const getConditionClass = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'very-good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fair':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-200 rounded-xl h-96"></div>
                <div className="bg-gray-200 rounded-xl h-64"></div>
              </div>
              <div className="bg-gray-200 rounded-xl h-80"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Product Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/products")} variant="outline">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gem className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Product Not Found</h3>
          <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/products")} variant="outline">
            Browse All Products
          </Button>
        </div>
      </div>
    );
  }

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/products")}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
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
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Stock Status Badge */}
                    <div className="absolute top-4 left-4">
                      {product.isInStock ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Gem className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="p-6">
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setLightboxStartIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          index === lightboxStartIndex
                            ? "border-amber-500 scale-105 shadow-lg"
                            : "border-transparent hover:border-gray-300 hover:scale-105"
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
            </div>

            {/* Enhanced Product Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
                      {product.category.name}
                    </Badge>
                    {product.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        ⭐ Featured
                      </Badge>
                    )}
                    {product.authenticity.certified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Award className="w-3 h-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-amber-500" />
                      <span className="text-sm font-medium">SKU: {product.sku}</span>
                    </div>
                    {product.period && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">{product.period}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Price Display */}
                <div className="text-center lg:text-right bg-gradient-to-br from-amber-50 to-yellow-50 p-4 lg:p-6 rounded-2xl border border-amber-100 lg:flex-shrink-0">
                  {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          -{savings?.percentage}%
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        {formatPrice(product.discountedPrice, product.currency)}
                      </div>
                      <div className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                        Save {formatPrice(savings?.amount || 0, product.currency)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-amber-600">
                      {formatPrice(product.price, product.currency)}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Product Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <Crown className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {product.material || "Various"}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Material</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <Scale className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${getConditionClass(product.condition)} mx-auto inline-block`}>
                    {product.condition.replace('-', ' ')}
                  </div>
                  <div className="text-sm text-gray-600 font-medium mt-2">Condition</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {product.stockQuantity}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Available</div>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="description" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="authenticity" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Authenticity
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-8">
                  <div className="space-y-8">
                    <h4 className="font-bold text-2xl text-gray-900">Product Details</h4>

                    {product.shortDescription && (
                      <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-500">
                        <h5 className="font-semibold text-amber-900 mb-3 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Quick Overview
                        </h5>
                        <p className="text-amber-800 leading-relaxed text-lg">{product.shortDescription}</p>
                      </div>
                    )}

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h6 className="font-semibold text-gray-900 flex items-center">
                          <Gem className="w-5 h-5 mr-2 text-purple-500" />
                          Basic Information
                        </h6>
                        <div className="space-y-3">
                          {product.origin && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Origin:</span>
                              <span className="font-medium text-gray-900">{product.origin}</span>
                            </div>
                          )}
                          {product.period && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Period:</span>
                              <span className="font-medium text-gray-900">{product.period}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Condition:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getConditionClass(product.condition)}`}>
                              {product.condition.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Stock:</span>
                            <span className="font-medium text-gray-900">
                              {product.stockQuantity} {product.stockQuantity === 1 ? 'piece' : 'pieces'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h6 className="font-semibold text-gray-900 flex items-center">
                          <Ruler className="w-5 h-5 mr-2 text-blue-500" />
                          Physical Properties
                        </h6>
                        <div className="space-y-3">
                          {product.weight && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium text-gray-900">{product.weight}g</span>
                            </div>
                          )}
                          {product.dimensions && formatDimensions(product.dimensions) && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Dimensions:</span>
                              <span className="font-medium text-gray-900">{formatDimensions(product.dimensions)}</span>
                            </div>
                          )}
                          {product.material && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Material:</span>
                              <span className="font-medium text-gray-900">{product.material}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gemstones Information */}
                    {product.gemstones && product.gemstones.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-bold text-xl text-gray-900 flex items-center">
                          <Gem className="w-6 h-6 mr-2 text-purple-500" />
                          Gemstones
                        </h5>
                        <div className="grid gap-4">
                          {product.gemstones.map((gemstone, index) => (
                            <div key={index} className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h6 className="font-semibold text-purple-900 mb-2">{gemstone.type}</h6>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {gemstone.carat && (
                                      <div>
                                        <span className="text-gray-600">Carat: </span>
                                        <span className="font-medium text-gray-900">{gemstone.carat}ct</span>
                                      </div>
                                    )}
                                    {gemstone.cut && (
                                      <div>
                                        <span className="text-gray-600">Cut: </span>
                                        <span className="font-medium text-gray-900">{gemstone.cut}</span>
                                      </div>
                                    )}
                                    {gemstone.color && (
                                      <div>
                                        <span className="text-gray-600">Color: </span>
                                        <span className="font-medium text-gray-900">{gemstone.color}</span>
                                      </div>
                                    )}
                                    {gemstone.clarity && (
                                      <div>
                                        <span className="text-gray-600">Clarity: </span>
                                        <span className="font-medium text-gray-900">{gemstone.clarity}</span>
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
                    <h4 className="font-bold text-2xl text-gray-900">Description</h4>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {product.description || "No detailed description available for this product."}
                      </p>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-bold text-xl text-gray-900">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-sm px-3 py-1 hover:bg-gray-100">
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
                    <h4 className="font-bold text-2xl text-gray-900">Technical Specifications</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Physical Specifications */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-xl text-gray-900 flex items-center">
                          <Ruler className="w-6 h-6 mr-2 text-blue-500" />
                          Physical Details
                        </h5>
                        <div className="space-y-3">
                          <div className="p-4 border-2 border-gray-200 rounded-xl">
                            <div className="grid gap-3">
                              {product.material && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Material:</span>
                                  <span className="font-medium text-gray-900">{product.material}</span>
                                </div>
                              )}
                              {product.weight && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Weight:</span>
                                  <span className="font-medium text-gray-900">{product.weight} grams</span>
                                </div>
                              )}
                              {product.dimensions && formatDimensions(product.dimensions) && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Dimensions:</span>
                                  <span className="font-medium text-gray-900">{formatDimensions(product.dimensions)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">Condition:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getConditionClass(product.condition)}`}>
                                  {product.condition.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historical Information */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-xl text-gray-900 flex items-center">
                          <Calendar className="w-6 h-6 mr-2 text-purple-500" />
                          Historical Context
                        </h5>
                        <div className="space-y-3">
                          <div className="p-4 border-2 border-gray-200 rounded-xl">
                            <div className="grid gap-3">
                              {product.period && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Period:</span>
                                  <span className="font-medium text-gray-900">{product.period}</span>
                                </div>
                              )}
                              {product.origin && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Origin:</span>
                                  <span className="font-medium text-gray-900">{product.origin}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">SKU:</span>
                                <span className="font-medium text-gray-900 font-mono">{product.sku}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Listed:</span>
                                <span className="font-medium text-gray-900">
                                  {new Date(product.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gemstones Detailed Table */}
                    {product.gemstones && product.gemstones.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-bold text-xl text-gray-900 flex items-center">
                          <Gem className="w-6 h-6 mr-2 text-purple-500" />
                          Gemstone Analysis
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden">
                            <thead>
                              <tr className="bg-purple-50">
                                <th className="border border-gray-200 p-3 text-left font-semibold text-purple-900">Gemstone</th>
                                <th className="border border-gray-200 p-3 text-left font-semibold text-purple-900">Carat</th>
                                <th className="border border-gray-200 p-3 text-left font-semibold text-purple-900">Cut</th>
                                <th className="border border-gray-200 p-3 text-left font-semibold text-purple-900">Color</th>
                                <th className="border border-gray-200 p-3 text-left font-semibold text-purple-900">Clarity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.gemstones.map((gemstone, index) => (
                                <tr key={index} className="hover:bg-purple-25">
                                  <td className="border border-gray-200 p-3 font-medium">{gemstone.type}</td>
                                  <td className="border border-gray-200 p-3">{gemstone.carat ? `${gemstone.carat}ct` : '-'}</td>
                                  <td className="border border-gray-200 p-3">{gemstone.cut || '-'}</td>
                                  <td className="border border-gray-200 p-3">{gemstone.color || '-'}</td>
                                  <td className="border border-gray-200 p-3">{gemstone.clarity || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Description Tab */}
                <TabsContent value="description" className="mt-8">
                  <div className="space-y-8">
                    <h4 className="font-bold text-2xl text-gray-900">Detailed Description</h4>

                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        {product.description || "No detailed description available for this product."}
                      </div>
                    </div>

                    {product.tags && product.tags.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-bold text-xl text-gray-900">Related Tags</h5>
                        <div className="flex flex-wrap gap-3">
                          {product.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-sm px-4 py-2 hover:bg-amber-50 hover:border-amber-300 transition-colors cursor-pointer"
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
                    <h4 className="font-bold text-2xl text-gray-900">Complete Specifications</h4>
                    
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="divide-y divide-gray-200">
                        <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50">
                          <h5 className="font-bold text-lg text-amber-900 mb-4">Product Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Product Name:</span>
                                <span className="font-medium text-gray-900">{product.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">SKU:</span>
                                <span className="font-medium text-gray-900 font-mono">{product.sku}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium text-gray-900">{product.category.name}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Stock Level:</span>
                                <span className={`font-medium ${product.isInStock ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.isInStock ? `${product.stockQuantity} Available` : 'Out of Stock'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Condition:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getConditionClass(product.condition)}`}>
                                  {product.condition.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(product.material || product.weight || product.dimensions) && (
                          <div className="p-6">
                            <h5 className="font-bold text-lg text-gray-900 mb-4">Physical Attributes</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {product.material && (
                                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                                  <Crown className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                  <div className="font-semibold text-gray-900">{product.material}</div>
                                  <div className="text-sm text-gray-600">Material</div>
                                </div>
                              )}
                              {product.weight && (
                                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <Scale className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                  <div className="font-semibold text-gray-900">{product.weight}g</div>
                                  <div className="text-sm text-gray-600">Weight</div>
                                </div>
                              )}
                              {product.dimensions && formatDimensions(product.dimensions) && (
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                  <Ruler className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                  <div className="font-semibold text-gray-900 text-sm">{formatDimensions(product.dimensions)}</div>
                                  <div className="text-sm text-gray-600">Size</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {(product.period || product.origin) && (
                          <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                            <h5 className="font-bold text-lg text-purple-900 mb-4">Historical Context</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {product.period && (
                                <div className="space-y-2">
                                  <span className="text-purple-700 font-medium">Historical Period:</span>
                                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                                    <span className="font-semibold text-purple-900">{product.period}</span>
                                  </div>
                                </div>
                              )}
                              {product.origin && (
                                <div className="space-y-2">
                                  <span className="text-purple-700 font-medium">Country of Origin:</span>
                                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                                    <span className="font-semibold text-purple-900">{product.origin}</span>
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
                    <h4 className="font-bold text-2xl text-gray-900">Authenticity & Certification</h4>

                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
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
                          <h5 className="font-bold text-xl text-green-900 mb-2">
                            {product.authenticity.certified ? 'Certified Authentic' : 'Authentication Pending'}
                          </h5>
                          <p className="text-green-800 leading-relaxed">
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
                          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <h6 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Certificate className="w-5 h-5 mr-2 text-blue-500" />
                              Certificate Details
                            </h6>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Certificate #:</span>
                                <span className="font-medium text-gray-900 font-mono">
                                  {product.authenticity.certificateNumber}
                                </span>
                              </div>
                              {product.authenticity.certifyingBody && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Certified by:</span>
                                  <span className="font-medium text-gray-900">
                                    {product.authenticity.certifyingBody}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <h6 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            Authenticity Guarantee
                          </h6>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Expert Authentication</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Certificate of Authenticity</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>30-Day Return Policy</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Lifetime Authenticity Guarantee</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!product.authenticity.certified && (
                      <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm font-bold">!</span>
                          </div>
                          <div>
                            <h6 className="font-semibold text-orange-900 mb-2">Authentication Note</h6>
                            <p className="text-sm text-orange-800 leading-relaxed">
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
            </div>
          </div>

          {/* Enhanced Purchase Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Purchase?</h3>
                <p className="text-gray-600">Add this unique piece to your collection</p>
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                  <div className="text-center">
                    <div className="text-sm text-gray-500 line-through mb-1">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {formatPrice(product.discountedPrice, product.currency)}
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Save {savings?.percentage}% • {formatPrice(savings?.amount || 0, product.currency)}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {formatPrice(product.price, product.currency)}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.isInStock ? (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        {product.stockQuantity} {product.stockQuantity === 1 ? 'piece' : 'pieces'} available
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-center gap-2 text-red-700">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">Currently Out of Stock</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
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
                    : "Add to Cart"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-4 text-lg font-medium rounded-xl border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200"
                  size="lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Request More Info
                </Button>
              </div>

              <Separator className="my-6" />
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Secure Payments</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">30-Day Return Policy</span>
                </div>
              </div>
            </div>

            {/* Product Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500">
              <h4 className="font-bold text-lg text-gray-900 mb-4">Quick Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{product.category.name}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900">{product.material}</span>
                  </div>
                )}
                {product.period && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium text-gray-900">{product.period}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${getConditionClass(product.condition)}`}>
                    {product.condition.replace('-', ' ')}
                  </span>
                </div>
                {product.authenticity.certified && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certified:</span>
                    <span className="font-medium text-green-600">
                      <Award className="w-4 h-4 inline mr-1" />
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-700">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Care Instructions
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="font-medium text-amber-900 mb-1">Storage</div>
                  <div className="text-amber-800">Keep in a cool, dry place away from direct sunlight</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-900 mb-1">Cleaning</div>
                  <div className="text-blue-800">Use soft cloth and appropriate jewelry cleaners only</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-900 mb-1">Handling</div>
                  <div className="text-green-800">Handle with care to preserve historical integrity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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