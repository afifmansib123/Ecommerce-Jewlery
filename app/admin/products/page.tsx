"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Gem,
  MoreHorizontal,
  Filter,
  Star,
  DollarSign,
  Package2,
  Eye,
  Crown,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: Category;
  price: number;
  discountedPrice?: number;
  currency: string;
  sku: string;
  stockQuantity: number;
  isInStock: boolean;
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
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const AdminProducts: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get unique materials for filter dropdown
  const [materials, setMaterials] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, selectedCategory, selectedCondition, selectedMaterial, showActiveOnly, showFeaturedOnly, showInStockOnly, showCertifiedOnly]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchProducts();
    }
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?isActive=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        populate: 'true',
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (selectedCondition !== 'all') {
        params.append('condition', selectedCondition);
      }
      if (selectedMaterial !== 'all') {
        params.append('material', selectedMaterial);
      }
      if (showActiveOnly) {
        params.append('isActive', 'true');
      }
      if (showFeaturedOnly) {
        params.append('isFeatured', 'true');
      }
      if (showInStockOnly) {
        params.append('inStock', 'true');
      }
      if (showCertifiedOnly) {
        params.append('certified', 'true');
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);

        // Extract unique materials for filter
        const uniqueMaterials = Array.from(new Set(
          data.products
            .map(product => product.material)
            .filter(material => material && material.trim())
        ));
        setMaterials(uniqueMaterials);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this antique piece? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        toast.success('Antique piece deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const toggleFeatured = async (productId: string, isFeatured: boolean) => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          isFeatured: !isFeatured,
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === productId ? updatedProduct : p));
        toast.success(`Product ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedMaterial('all');
    setShowActiveOnly(false);
    setShowFeaturedOnly(false);
    setShowInStockOnly(false);
    setShowCertifiedOnly(false);
  };

  const actions = (
    <div className="flex space-x-2">
      <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white shadow-md">
        <Link href="/admin/products/new" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Antique</span>
        </Link>
      </Button>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <AdminLayout
        title="Antique Jewelry Collection"
        subtitle="Manage your precious antique jewelry inventory"
        actions={actions}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-700 font-medium">Loading treasures...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Antique Jewelry Collection"
      subtitle="Curate and manage your precious antique jewelry pieces"
      actions={actions}
    >
      {/* Antique-styled Filters */}
      <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
              <Input
                placeholder="Search antiques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-amber-300">
                <SelectValue placeholder="Select category" />
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

            {/* Condition Filter */}
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="border-amber-300">
                <SelectValue placeholder="Condition" />
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

            {/* Material Filter */}
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger className="border-amber-300">
                <SelectValue placeholder="Material" />
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
          
          {/* Filter Toggles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active-filter"
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
              />
              <Label htmlFor="active-filter" className="text-sm text-amber-800">Active Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured-filter"
                checked={showFeaturedOnly}
                onCheckedChange={setShowFeaturedOnly}
              />
              <Label htmlFor="featured-filter" className="text-sm text-amber-800">Featured</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="instock-filter"
                checked={showInStockOnly}
                onCheckedChange={setShowInStockOnly}
              />
              <Label htmlFor="instock-filter" className="text-sm text-amber-800">In Stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="certified-filter"
                checked={showCertifiedOnly}
                onCheckedChange={setShowCertifiedOnly}
              />
              <Label htmlFor="certified-filter" className="text-sm text-amber-800">Certified</Label>
            </div>
          </div>
          
          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={resetFilters} className="border-amber-600 text-amber-700 hover:bg-amber-50">
              Clear All Filters
            </Button>
            <span className="text-sm text-amber-700">
              Displaying {products.length} of {totalCount} treasures
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Products Collection */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center text-amber-900">
            <Crown className="h-6 w-6 mr-2 text-amber-600" />
            Antique Collection ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <Gem className="h-16 w-16 text-amber-300 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-amber-900 mb-2">
                {totalCount === 0 ? 'No Antiques in Collection' : 'No matching pieces found'}
              </h3>
              <p className="text-amber-700 mb-6">
                {totalCount === 0 ? 'Begin building your precious collection' : 'Try adjusting your search or filters'}
              </p>
              {totalCount === 0 && (
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/admin/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Antique
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50/50">
                      <TableHead className="text-amber-900">Antique Piece</TableHead>
                      <TableHead className="text-amber-900">Category</TableHead>
                      <TableHead className="text-amber-900">SKU</TableHead>
                      <TableHead className="text-amber-900">Price</TableHead>
                      <TableHead className="text-amber-900">Condition</TableHead>
                      <TableHead className="text-amber-900">Stock</TableHead>
                      <TableHead className="text-amber-900">Status</TableHead>
                      <TableHead className="text-right text-amber-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-amber-50/30">
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover border border-amber-200 shadow-sm"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center border border-amber-200">
                                  <Gem className="h-6 w-6 text-amber-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-amber-900 flex items-center">
                                {product.name}
                                {product.isFeatured && (
                                  <Star className="inline h-4 w-4 text-amber-500 ml-2" />
                                )}
                                {product.authenticity.certified && (
                                  <Sparkles className="inline h-3 w-3 text-emerald-500 ml-1" />
                                )}
                              </div>
                              <div className="text-sm text-amber-700 max-w-xs truncate">
                                {product.material && <span className="font-medium">{product.material}</span>}
                                {product.period && <span className="ml-2">• {product.period}</span>}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-amber-300 text-amber-800">
                            {product.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                            {product.sku}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-amber-900">
                            ${product.price.toLocaleString()}
                            {product.discountedPrice && (
                              <div className="text-xs text-amber-600 line-through">
                                ${product.discountedPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getConditionColor(product.condition)}>
                            {product.condition.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Package2 className="h-3 w-3 text-amber-600" />
                            <span className={`text-sm font-medium ${product.isInStock ? 'text-green-700' : 'text-red-600'}`}>
                              {product.stockQuantity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge variant={product.isActive ? 'default' : 'secondary'} className={product.isActive ? 'bg-green-100 text-green-800' : ''}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {product.isFeatured && (
                              <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-800">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/${product._id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/${product._id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleFeatured(product._id, product.isFeatured)}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                {product.isFeatured ? 'Unfeature' : 'Feature'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-amber-200 bg-amber-50/30">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-amber-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminProducts;