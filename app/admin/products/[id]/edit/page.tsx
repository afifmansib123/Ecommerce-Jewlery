"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  ArrowLeft,
  Save,
  Loader2,
  Gem,
  Crown,
  Star,
  Sparkles,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
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
  category: Category | string;
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
}

interface FormData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  price: string;
  discountedPrice: string;
  sku: string;
  stockQuantity: string;
  condition: string;
  material: string;
  period: string;
  origin: string;
  weight: string;
  certified: boolean;
  certificateNumber: string;
  certifyingBody: string;
  tags: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EditProduct: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: '',
    discountedPrice: '',
    sku: '',
    stockQuantity: '',
    condition: 'excellent',
    material: '',
    period: '',
    origin: '',
    weight: '',
    certified: false,
    certificateNumber: '',
    certifyingBody: '',
    tags: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?isActive=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}?populate=true`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Product not found');
          router.push('/admin/products');
          return;
        }
        throw new Error('Failed to fetch product');
      }

      const productData: Product = await response.json();
      setProduct(productData);

      // Populate form with existing data
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        shortDescription: productData.shortDescription || '',
        category: typeof productData.category === 'object' ? productData.category._id : productData.category,
        price: productData.price?.toString() || '',
        discountedPrice: productData.discountedPrice?.toString() || '',
        sku: productData.sku || '',
        stockQuantity: productData.stockQuantity?.toString() || '',
        condition: productData.condition || 'excellent',
        material: productData.material || '',
        period: productData.period || '',
        origin: productData.origin || '',
        weight: productData.weight?.toString() || '',
        certified: productData.authenticity?.certified || false,
        certificateNumber: productData.authenticity?.certificateNumber || '',
        certifyingBody: productData.authenticity?.certifyingBody || '',
        tags: productData.tags?.join(', ') || '',
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
      });

    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.discountedPrice && (isNaN(parseFloat(formData.discountedPrice)) || parseFloat(formData.discountedPrice) <= 0)) {
      newErrors.discountedPrice = 'Discounted price must be a valid positive number';
    }

    if (formData.discountedPrice && formData.price && parseFloat(formData.discountedPrice) >= parseFloat(formData.price)) {
      newErrors.discountedPrice = 'Discounted price must be less than original price';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.stockQuantity || isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }

    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Weight must be a valid number';
    }

    if (formData.certified && !formData.certificateNumber.trim()) {
      newErrors.certificateNumber = 'Certificate number is required for certified items';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim() || undefined,
        category: formData.category,
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
        sku: formData.sku.trim(),
        stockQuantity: parseInt(formData.stockQuantity),
        condition: formData.condition,
        material: formData.material.trim() || undefined,
        period: formData.period.trim() || undefined,
        origin: formData.origin.trim() || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        authenticity: {
          certified: formData.certified,
          certificateNumber: formData.certified ? formData.certificateNumber.trim() : undefined,
          certifyingBody: formData.certified ? formData.certifyingBody.trim() : undefined,
        },
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success('Antique piece updated successfully!');
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Edit Antique Piece"
        subtitle="Update precious collection item"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-700 font-medium">Loading antique details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout
        title="Product Not Found"
        subtitle="The requested antique piece could not be found"
      >
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-amber-900 mb-2">Product Not Found</h3>
          <p className="text-amber-700 mb-6">The antique piece you're looking for doesn't exist.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collection
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit: ${product.name}`}
      subtitle="Update antique piece details"
      actions={
        <Button asChild variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collection
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center text-amber-900">
              <Crown className="h-5 w-5 mr-2 text-amber-600" />
              Basic Information
            </CardTitle>
            <CardDescription className="text-amber-700">
              Essential details about this antique piece
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-amber-900">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Victorian Gold Brooch..."
                  className={`border-amber-300 focus:border-amber-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="sku" className="text-amber-900">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="ANT-VGB-001"
                  className={`border-amber-300 focus:border-amber-500 ${errors.sku ? 'border-red-500' : ''}`}
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription" className="text-amber-900">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description for listings..."
                className="border-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-amber-900">Full Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of this magnificent antique piece..."
                rows={4}
                className={`border-amber-300 focus:border-amber-500 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="tags" className="text-amber-900">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="vintage, gold, jewelry, victorian (comma separated)"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categorization & Pricing */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center text-amber-900">
              <Gem className="h-5 w-5 mr-2 text-amber-600" />
              Categorization & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-amber-900">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={`border-amber-300 ${errors.category ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="condition" className="text-amber-900">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger className="border-amber-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="very-good">Very Good</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price" className="text-amber-900">Price (THB) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="15000.00"
                  className={`border-amber-300 focus:border-amber-500 ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="discountedPrice" className="text-amber-900">Discounted Price (THB)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                  placeholder="12000.00"
                  className={`border-amber-300 focus:border-amber-500 ${errors.discountedPrice ? 'border-red-500' : ''}`}
                />
                {errors.discountedPrice && <p className="text-red-500 text-sm mt-1">{errors.discountedPrice}</p>}
              </div>

              <div>
                <Label htmlFor="stockQuantity" className="text-amber-900">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  placeholder="1"
                  className={`border-amber-300 focus:border-amber-500 ${errors.stockQuantity ? 'border-red-500' : ''}`}
                />
                {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Antique Details */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center text-amber-900">
              <Sparkles className="h-5 w-5 mr-2 text-amber-600" />
              Antique Details
            </CardTitle>
            <CardDescription className="text-amber-700">
              Historical and material information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="material" className="text-amber-900">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="Gold, Silver, Bronze..."
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>

              <div>
                <Label htmlFor="period" className="text-amber-900">Period/Era</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  placeholder="Victorian, Art Deco..."
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>

              <div>
                <Label htmlFor="origin" className="text-amber-900">Origin</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="England, France, Italy..."
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight" className="text-amber-900">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="15.5"
                  className={`border-amber-300 focus:border-amber-500 ${errors.weight ? 'border-red-500' : ''}`}
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authenticity */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center text-amber-900">
              <Star className="h-5 w-5 mr-2 text-amber-600" />
              Authenticity & Certification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="certified"
                checked={formData.certified}
                onCheckedChange={(checked) => handleInputChange('certified', checked)}
              />
              <Label htmlFor="certified" className="text-amber-900">This piece is certified authentic</Label>
            </div>

            {formData.certified && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <Label htmlFor="certificateNumber" className="text-amber-900">Certificate Number *</Label>
                  <Input
                    id="certificateNumber"
                    value={formData.certificateNumber}
                    onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                    placeholder="CERT-2024-001"
                    className={`border-amber-300 focus:border-amber-500 ${errors.certificateNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.certificateNumber && <p className="text-red-500 text-sm mt-1">{errors.certificateNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="certifyingBody" className="text-amber-900">Certifying Body</Label>
                  <Input
                    id="certifyingBody"
                    value={formData.certifyingBody}
                    onChange={(e) => handleInputChange('certifyingBody', e.target.value)}
                    placeholder="Antique Jewelry Association"
                    className="border-amber-300 focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Settings */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="text-amber-900">Status & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg bg-amber-50/30">
                <div>
                  <Label htmlFor="isActive" className="text-amber-900 font-medium">Active Status</Label>
                  <p className="text-sm text-amber-700">Make this product visible to customers</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg bg-amber-50/30">
                <div>
                  <Label htmlFor="isFeatured" className="text-amber-900 font-medium">Featured Item</Label>
                  <p className="text-sm text-amber-700">Highlight in featured collections</p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/products')}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;