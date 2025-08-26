"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Gem, Star, Heart, Package2, Crown, Sparkles, Scale } from "lucide-react";
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
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [materials, setMaterials] = useState<string[]>([]);
  const { addItem } = useCart();
  const { t } = useLanguage();

  // --- FETCH PRODUCTS AND CATEGORIES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products and categories in parallel
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

        // Extract unique materials
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

    // Filter by search term
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

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?._id === selectedCategory
      );
    }

    // Filter by condition
    if (selectedCondition !== "all") {
      filtered = filtered.filter(
        (product) => product.condition === selectedCondition
      );
    }

    // Filter by material
    if (selectedMaterial !== "all") {
      filtered = filtered.filter(
        (product) => product.material === selectedMaterial
      );
    }

    // Filter by certification
    if (showCertifiedOnly) {
      filtered = filtered.filter(
        (product) => product.authenticity.certified
      );
    }

    // Filter by stock status
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

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'very-good': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-amber-200 rounded-lg w-1/3"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="h-10 bg-amber-100 rounded-lg"></div>
                <div className="h-10 bg-amber-100 rounded-lg"></div>
                <div className="h-10 bg-amber-100 rounded-lg"></div>
                <div className="h-10 bg-amber-100 rounded-lg"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl h-96 shadow-sm border border-amber-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-12 w-12 mr-3 text-amber-200" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Antique Jewelry Collection
              </h1>
            </div>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Discover exquisite antique jewelry pieces with rich history and timeless elegance. Each piece tells a story of craftsmanship and heritage.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-amber-200 p-6 mb-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5 group-hover:text-amber-600 transition-colors" />
              <Input
                placeholder="Search antiques, materials, periods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-amber-200 focus:ring-2 focus:ring-amber-500">
                <Filter className="h-4 w-4 mr-2 text-amber-400" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="h-12 border-amber-200 focus:ring-2 focus:ring-amber-500">
                <Scale className="h-4 w-4 mr-2 text-amber-400" />
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
              <SelectTrigger className="h-12 border-amber-200 focus:ring-2 focus:ring-amber-500">
                <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
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
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCertifiedOnly}
                onChange={(e) => setShowCertifiedOnly(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-amber-800">Certified Only</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-amber-800">In Stock Only</span>
            </label>

            <div className="flex items-center justify-between text-amber-700 px-4 py-2 bg-amber-50 rounded-lg ml-auto">
              <span className="font-medium">{filteredProducts.length} pieces found</span>
              <Gem className="h-4 w-4 ml-2" />
            </div>
            
            {(searchTerm || selectedCategory !== "all" || selectedCondition !== "all" || selectedMaterial !== "all" || showCertifiedOnly || showInStockOnly) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredProducts.map((product, index) => (
            <Card
              key={product._id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col bg-white border border-amber-200 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                  <Badge className="bg-amber-600 hover:bg-amber-700 shadow-lg text-white">
                    {product.category?.name || "Uncategorized"}
                  </Badge>
                  <Badge className={`shadow-lg ${getConditionColor(product.condition)}`}>
                    {product.condition.replace('-', ' ')}
                  </Badge>
                </div>

                {/* Certification Badge */}
                {product.authenticity.certified && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-600 text-white shadow-lg flex items-center">
                      <Crown className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  </div>
                )}

                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-16 right-4">
                    <Badge className="bg-purple-600 text-white shadow-lg flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 line-through leading-none">
                        ${product.price.toLocaleString()}
                      </div>
                      <div className="text-lg font-bold text-red-600 leading-none">
                        ${product.discountedPrice.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-amber-900">
                      ${product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {!product.isInStock && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="destructive" className="shadow-lg">
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Like Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                  onClick={() => toggleLike(product._id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${likedProducts.has(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
              
              <CardContent className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                
                {/* Material and Period */}
                <div className="flex items-center gap-4 text-amber-700 mb-3">
                  {product.material && (
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
                      <span className="text-sm font-medium">{product.material}</span>
                    </div>
                  )}
                  {product.period && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{product.period}</span>
                    </div>
                  )}
                </div>

                {/* SKU and Weight */}
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="text-xs">
                    SKU: <code className="bg-amber-100 text-amber-800 px-1 rounded">{product.sku}</code>
                  </div>
                  {product.weight && (
                    <div className="text-xs">
                      <Scale className="h-3 w-3 inline mr-1" />
                      {product.weight}g
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                  {product.shortDescription || product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{product.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stock Info */}
                <div className="text-xs text-amber-600 mb-4 flex items-center">
                  <Package2 className="h-3 w-3 mr-1" />
                  Stock: {product.stockQuantity} available
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex-1 border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
                  >
                    <Link href={`/products/${product._id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.isInStock}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.isInStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16 animate-in fade-in-0 duration-500">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto border border-amber-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No antiques found</h3>
              <p className="text-amber-700 mb-6">
                Try adjusting your search criteria or browse all available pieces.
              </p>
              <Button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}