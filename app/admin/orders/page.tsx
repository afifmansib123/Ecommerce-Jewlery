"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gem,
  Crown,
  FolderOpen,
  BarChart3,
  TrendingUp,
  Star,
  DollarSign,
  Plus,
  ArrowRight,
  Eye,
  Package2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  overview: {
    totalCategories: number;
    activeCategories: number;
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
    inactiveCategories: number;
    inactiveProducts: number;
    lowStockProducts: number;
    certifiedProducts: number;
  };
  productsByCondition: Array<{
    condition: string;
    count: number;
  }>;
  productsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  recentProducts: Array<{
    _id: string;
    name: string;
    material?: string;
    price: number;
    createdAt: string;
    category: {
      name: string;
    };
    condition: string;
    stockQuantity: number;
  }>;
  priceStatistics: {
    averagePrice: number;
    minimumPrice: number;
    maximumPrice: number;
    totalProductsWithPrice: number;
  };
  generatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add New Antique',
      description: 'Catalog a new piece for your collection',
      href: '/admin/products/new',
      icon: Gem,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    },
    {
      title: 'Manage Categories',
      description: 'Organize your jewelry collections',
      href: '/admin/categories',
      icon: FolderOpen,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    },
    {
      title: 'View Orders',
      description: 'Check recent customer orders',
      href: '/admin/orders',
      icon: Package2,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600',
    },
  ];

  if (loading) {
    return (
      <AdminLayout
        title="Antique Jewelry Dashboard"
        subtitle="Manage your precious collection"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-700 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Antique Jewelry Dashboard"
      subtitle="Overview of your precious collection and business"
    >
      <div className="space-y-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-amber-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200 hover:border-amber-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-xl ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-amber-900 text-lg">
                            {action.title}
                          </h3>
                          <p className="text-sm text-amber-700">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Overview Stats */}
        {stats && (
          <>
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
                <Crown className="h-6 w-6 mr-2 text-amber-600" />
                Collection Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-amber-900">
                          {stats.overview.totalCategories}
                        </div>
                        <div className="text-sm text-amber-700">Categories</div>
                        <div className="text-xs text-amber-600 mt-1">
                          {stats.overview.activeCategories} active
                        </div>
                      </div>
                      <FolderOpen className="h-10 w-10 text-amber-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-emerald-900">
                          {stats.overview.totalProducts}
                        </div>
                        <div className="text-sm text-emerald-700">Antique Pieces</div>
                        <div className="text-xs text-emerald-600 mt-1">
                          {stats.overview.activeProducts} active
                        </div>
                      </div>
                      <Gem className="h-10 w-10 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-purple-900">
                          {stats.overview.featuredProducts}
                        </div>
                        <div className="text-sm text-purple-700">Featured Items</div>
                        <div className="text-xs text-purple-600 mt-1">
                          {stats.overview.certifiedProducts} certified
                        </div>
                      </div>
                      <Star className="h-10 w-10 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-orange-900">
                          ${stats.priceStatistics.averagePrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-700">Avg. Value</div>
                        <div className="text-xs text-orange-600 mt-1">
                          ${stats.priceStatistics.minimumPrice.toLocaleString()} - ${stats.priceStatistics.maximumPrice.toLocaleString()}
                        </div>
                      </div>
                      <DollarSign className="h-10 w-10 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Products by Category */}
              <Card className="border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center text-amber-900">
                    <FolderOpen className="h-5 w-5 mr-2 text-amber-600" />
                    Collection by Category
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Distribution of antiques across categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {stats.productsByCategory.slice(0, 5).map((category) => (
                      <div key={category.categoryId} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-amber-900">
                              {category.categoryName}
                            </span>
                            <span className="text-sm text-amber-700 font-semibold">
                              {category.count}
                            </span>
                          </div>
                          <div className="w-full bg-amber-100 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500" 
                              style={{
                                width: `${Math.min((category.count / stats.overview.totalProducts) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Products by Condition */}
              <Card className="border-emerald-200">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <CardTitle className="flex items-center text-emerald-900">
                    <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                    Condition Distribution
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    Quality assessment of your collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {stats.productsByCondition.map((condition) => (
                      <div key={condition.condition} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="outline"
                            className={
                              condition.condition === 'excellent' ? 'border-emerald-300 text-emerald-800 bg-emerald-50' :
                              condition.condition === 'very-good' ? 'border-green-300 text-green-800 bg-green-50' :
                              condition.condition === 'good' ? 'border-yellow-300 text-yellow-800 bg-yellow-50' :
                              condition.condition === 'fair' ? 'border-orange-300 text-orange-800 bg-orange-50' :
                              'border-red-300 text-red-800 bg-red-50'
                            }
                          >
                            {condition.condition.replace('-', ' ')}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold text-emerald-900">
                          {condition.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card className="border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-amber-900">
                      <Gem className="h-5 w-5 mr-2 text-amber-600" />
                      Recently Added Treasures
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Your latest catalog additions
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    <Link href="/admin/products">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {stats.recentProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border border-amber-200 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 hover:from-amber-100/50 hover:to-orange-100/50 transition-all">
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900">{product.name}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                          {product.material && (
                            <span className="text-sm text-amber-700 flex items-center">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {product.material}
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                            {product.category.name}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              product.condition === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                              product.condition === 'very-good' ? 'bg-green-100 text-green-800' :
                              product.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                              product.condition === 'fair' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.condition.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-900 text-lg">
                          ${product.price.toLocaleString()}
                        </span>
                        <p className="text-xs text-amber-600">
                          Stock: {product.stockQuantity}
                        </p>
                        <p className="text-xs text-amber-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;