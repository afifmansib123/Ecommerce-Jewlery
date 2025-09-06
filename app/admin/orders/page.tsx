"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Clock, 
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Edit,
  Save,
  X,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    paymentStatus: '',
    notes: ''
  });

  const fetchOrders = async (page = 1, status = 'all', paymentStatus = 'all', search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (status !== 'all') params.append('status', status);
      if (paymentStatus !== 'all') params.append('paymentStatus', paymentStatus);
      if (search) params.append('search', search);

      const response = await fetch(`/api/orders/admin?${params}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        setPagination(data.pagination);
        setStats(data.stats);
      } else {
        toast.error(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId: string, updates: any) => {
    try {
      const response = await fetch('/api/orders/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...updates })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order updated successfully');
        setEditingOrder(null);
        fetchOrders(currentPage, filter, paymentFilter, searchTerm);
      } else {
        toast.error(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, filter, paymentFilter, searchTerm);
  }, [currentPage, filter, paymentFilter, searchTerm]);

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

  const openEditDialog = (order: Order) => {
    setEditingOrder(order);
    setUpdateData({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes || ''
    });
  };

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
              <div className="w-14 h-14 bg-gradient-to-br from-stone-700 to-stone-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-stone-900 tracking-wide">
                  Order Management
                </h1>
                <p className="text-stone-600 font-light">
                  Admin dashboard for managing customer orders
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => fetchOrders(currentPage, filter, paymentFilter, searchTerm)}
                variant="outline"
                className="rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 font-light">Total Orders</p>
                  <p className="text-2xl font-light text-stone-900">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-stone-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 font-light">Total Revenue</p>
                  <p className="text-2xl font-light text-stone-900">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 font-light">Pending</p>
                  <p className="text-2xl font-light text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 font-light">Confirmed</p>
                  <p className="text-2xl font-light text-blue-600">{stats.confirmedOrders}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600 font-light">Cancelled</p>
                  <p className="text-2xl font-light text-red-600">{stats.cancelledOrders}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-100/50 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-stone-200"
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="rounded-xl border-stone-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="rounded-xl border-stone-200">
                <CreditCard className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </motion.div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
              <span className="text-stone-600 font-light">Loading orders...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Package className="w-16 h-16 mx-auto text-stone-400 mb-4" />
            <h3 className="text-xl font-light text-stone-900 mb-2">No Orders Found</h3>
            <p className="text-stone-600">No orders match your current filters</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg border border-stone-100/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Order Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-light text-stone-900 text-lg">{order.orderNumber}</h3>
                                <p className="text-sm text-stone-600">Customer: {order.cognitoId}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getStatusColor(order.status)} font-light border`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                              <Badge className={`${getPaymentStatusColor(order.paymentStatus)} font-light border`}>
                                <span className="capitalize">{order.paymentStatus}</span>
                              </Badge>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                            {order.items.slice(0, 3).map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center space-x-2 bg-stone-50 rounded-lg p-2 min-w-fit">
                                <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-stone-900 truncate max-w-32">{item.name}</p>
                                  <p className="text-xs text-stone-600">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-xs text-stone-600 font-light px-2">
                                +{order.items.length - 3} more
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-6 text-sm text-stone-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-1" />
                                {order.paymentMethod.toUpperCase()}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-stone-600">Total Amount</p>
                              <p className="text-xl font-light text-stone-900">
                                {formatPrice(order.totalAmount)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="rounded-xl flex-1 lg:flex-none lg:w-full"
                                onClick={() => openEditDialog(order)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Order: {order.orderNumber}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-stone-700">Order Status</label>
                                  <Select 
                                    value={updateData.status} 
                                    onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-stone-700">Payment Status</label>
                                  <Select 
                                    value={updateData.paymentStatus} 
                                    onValueChange={(value) => setUpdateData(prev => ({ ...prev, paymentStatus: value }))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="paid">Paid</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                      <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-stone-700">Notes</label>
                                  <Textarea 
                                    placeholder="Add notes about this order..."
                                    value={updateData.notes}
                                    onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setEditingOrder(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => updateOrder(order._id, updateData)}
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="rounded-xl flex-1 lg:flex-none lg:w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div 
            className="flex items-center justify-center space-x-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!pagination.hasPrev}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <span className="text-stone-600 font-light">
              Page {currentPage} of {pagination.totalPages} ({pagination.totalOrders} total orders)
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNext}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}