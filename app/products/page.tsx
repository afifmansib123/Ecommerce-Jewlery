"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Gem, Star, Package2, Crown, Sparkles, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// --- PRODUCT INTERFACE FOR ANTIQUE JEWELRY ---
interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  sku: string;
  stockQuantity: number;
  isInStock: boolean;
  category: {
    _id: string;
    name: string;
  };
  condition: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  material?: string;
  period?: string;
  origin?: string;
  weight?: number;
  authenticity: {
    certified: boolean;
    certificateNumber?: string;
    certifyingBody?: string;
  };
  images: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<string[]>([]);
  const { addItem } = useCart();
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

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // --- FETCH PRODUCTS AND CATEGORIES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/products?populate=true&isActive=true"),
          fetch("/api/categories?isActive=true"),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData.products || []);
        setFilteredProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);

        const uniqueMaterials = Array.from(new Set(
          productsData.products
            .map((product: Product) => product.material)
            .filter((material: string) => material && material.trim())
        ));
        setMaterials(uniqueMaterials);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product data. Please try again later.");
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedTerm) ||
          product.material?.toLowerCase().includes(lowercasedTerm) ||
          product.period?.toLowerCase().includes(lowercasedTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)) ||
          product.sku.toLowerCase().includes(lowercasedTerm) ||
          (product.shortDescription &&
            product.shortDescription.toLowerCase().includes(lowercasedTerm))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?._id === selectedCategory
      );
    }

    if (selectedCondition !== "all") {
      filtered = filtered.filter(
        (product) => product.condition === selectedCondition
      );
    }

    if (selectedMaterial !== "all") {
      filtered = filtered.filter(
        (product) => product.material === selectedMaterial
      );
    }

    if (showCertifiedOnly) {
      filtered = filtered.filter(
        (product) => product.authenticity.certified
      );
    }

    if (showInStockOnly) {
      filtered = filtered.filter(
        (product) => product.isInStock
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedCondition, selectedMaterial, showCertifiedOnly, showInStockOnly, products]);

  const handleAddToCart = (product: Product) => {
    if (!product.isInStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    
    const finalPrice = product.discountedPrice && product.discountedPrice > 0 ? product.discountedPrice : product.price;
    
    addItem({
      id: product._id as any,
      name: product.name,
      price: finalPrice,
      image: product.images[0] || "/placeholder.png",
    });
    toast.success(`${product.name} added to cart!`);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'very-good': return 'bg-green-50 text-green-700 border-green-200';
      case 'good': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'fair': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'poor': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedMaterial("all");
    setShowCertifiedOnly(false);
    setShowInStockOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-stone-200 rounded-lg w-1/3"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="h-10 bg-stone-100 rounded-lg"></div>
                <div className="h-10 bg-stone-100 rounded-lg"></div>
                <div className="h-10 bg-stone-100 rounded-lg"></div>
                <div className="h-10 bg-stone-100 rounded-lg"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl h-96 shadow-sm border border-stone-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
      {/* Hero Header */}
      <motion.div 
        className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex items-center justify-center mb-6" variants={itemVariants}>
              <Crown className="h-12 w-12 mr-3 text-stone-200" />
              <h1 className="text-4xl md:text-6xl font-light">
                {t('tours.title')
                  .split(' ')
                  .map((word, index) => (
                    <span key={index}>
                      {index === 1 ? (
                        <span className="font-serif italic text-stone-200">{word}</span>
                      ) : (
                        word
                      )}
                      {index < t('tours.title').split(' ').length - 1 && ' '}
                    </span>
                  ))}
              </h1>
            </motion.div>
            <motion.p 
              className="text-xl text-stone-100 max-w-2xl mx-auto font-light leading-relaxed"
              variants={itemVariants}
            >
              {t('tours.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <motion.div 
          className="backdrop-filter backdrop-blur-20 bg-white/95 rounded-2xl shadow-2xl border border-stone-100/50 p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5 group-hover:text-stone-600 transition-colors" />
              <Input
                placeholder={t('tours.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-stone-200 focus:ring-2 focus:ring-stone-500/50 focus:border-stone-500 rounded-xl transition-all duration-300 bg-white/90"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-stone-200 focus:ring-2 focus:ring-stone-500/50 rounded-xl">
                <Filter className="h-4 w-4 mr-2 text-stone-400" />
                <SelectValue placeholder={t('tours.category.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('tours.category.all')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="h-12 border-stone-200 focus:ring-2 focus:ring-stone-500/50 rounded-xl">
                <Scale className="h-4 w-4 mr-2 text-stone-400" />
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger className="h-12 border-stone-200 focus:ring-2 focus:ring-stone-500/50 rounded-xl">
                <Sparkles className="h-4 w-4 mr-2 text-stone-400" />
                <SelectValue placeholder="All Materials" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {materials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 text-sm">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showCertifiedOnly}
                  onChange={(e) => setShowCertifiedOnly(e.target.checked)}
                  className="rounded border-stone-300 text-stone-600 focus:ring-stone-500/50"
                />
                <span className="text-stone-800 group-hover:text-stone-900 transition-colors font-medium">Certified Only</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-stone-600 focus:ring-stone-500/50"
                />
                <span className="text-stone-800 group-hover:text-stone-900 transition-colors font-medium">In Stock Only</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-between text-stone-700 px-4 py-2 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-medium">{filteredProducts.length} pieces found</span>
                <Gem className="h-4 w-4 ml-2" />
              </div>
              
              {(searchTerm || selectedCategory !== "all" || selectedCondition !== "all" || selectedMaterial !== "all" || showCertifiedOnly || showInStockOnly) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl"
                >
                  {t('tours.clearFilters')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col bg-white border border-stone-200 shadow-lg rounded-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        product.images[0] ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Category & Condition Badges */}
                    <div className="absolute top-4 left-4 space-y-2">
                      <Badge className="bg-stone-800/90 backdrop-blur-sm hover:bg-stone-900 shadow-lg text-white font-medium">
                        {product.category?.name || "Uncategorized"}
                      </Badge>
                      <Badge className={`shadow-lg border font-medium ${getConditionColor(product.condition)}`}>
                        {product.condition.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Certification Badge */}
                    {product.authenticity.certified && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-emerald-600/90 backdrop-blur-sm text-white shadow-lg flex items-center font-medium">
                          <Crown className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {product.isFeatured && (
                      <div className="absolute top-16 right-4">
                        <Badge className="bg-purple-600/90 backdrop-blur-sm text-white shadow-lg flex items-center font-medium">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                        <div className="text-right">
                          <div className="text-xs text-stone-500 line-through leading-none">
                            ฿{product.price.toLocaleString()}
                          </div>
                          <div className="text-lg font-bold text-emerald-600 leading-none">
                            ฿{product.discountedPrice.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-stone-900">
                          ${product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {!product.isInStock && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="destructive" className="shadow-lg bg-red-600/90 backdrop-blur-sm">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-stone-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Material and Period */}
                    <div className="flex items-center gap-4 text-stone-700 mb-3">
                      {product.material && (
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-1 text-stone-500" />
                          <span className="text-sm font-medium">{product.material}</span>
                        </div>
                      )}
                      {product.period && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-stone-600">{product.period}</span>
                        </div>
                      )}
                    </div>

                    {/* SKU and Weight */}
                    <div className="flex items-center gap-4 text-stone-600 mb-3">
                      <div className="text-xs">
                        SKU: <code className="bg-stone-100 text-stone-800 px-2 py-1 rounded font-mono text-xs">{product.sku}</code>
                      </div>
                      {product.weight && (
                        <div className="text-xs flex items-center">
                          <Scale className="h-3 w-3 mr-1" />
                          {product.weight}g
                        </div>
                      )}
                    </div>
                    
                    <p className="text-stone-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                      {product.shortDescription || product.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-600">
                          +{product.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stock Info */}
                    <div className="text-xs text-stone-600 mb-4 flex items-center">
                      <Package2 className="h-3 w-3 mr-1" />
                      Stock: {product.stockQuantity} available
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <Button 
                        asChild 
                        variant="outline" 
                        className="flex-1 border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 rounded-xl"
                      >
                        <Link href={`/products/${product._id}`}>
                          {t('tours.viewDetails')}
                        </Link>
                      </Button>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.isInStock}
                        className="flex-1 bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                      >
                        {product.isInStock ? t('tours.addToCart') : "Out of Stock"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && !loading && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-stone-200">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gem className="h-8 w-8 text-stone-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-4">{t('tours.noResults')}</h3>
              <p className="text-stone-700 mb-8 font-light">
                Try adjusting your search criteria or browse all available pieces.
              </p>
              <Button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 rounded-xl"
              >
                {t('tours.clearFilters')}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}