import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  ShoppingCart, 
  Search, 
  Eye,
  Download,
  Calendar,
  User,
  Clock,
  Filter
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useFormatCurrency } from '../../lib/utils'
import { 
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { toast } from 'sonner'

interface Order {
  id: string
  user_id: string
  user_email?: string
  user_name?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shipping_address: Address
  billing_address: Address
  payment_status: 'paid' | 'unpaid' | 'refunded'
  created_at: string
  updated_at: string
  tracking_number?: string
  customer_phone?: number
}

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  subtotal: number
}

interface Address {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  customer_phone?: number
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  
  const ordersPerPage = 10
  const formatCurrency = useFormatCurrency()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      
      // Fetch orders from Supabase
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Supabase error:', ordersError)
        throw new Error(`Failed to fetch orders: ${ordersError.message}`)
      }

      if (!ordersData) {
        console.warn('No orders data returned from Supabase')
        setOrders([])
        return
      }

      // Fetch user information for each order
      const ordersWithUserInfo = await Promise.all(
        ordersData.map(async (order) => {
          let userData = null
          
          // Only fetch user data if user_id exists
          if (order.user_id) {
            const { data, error: userError } = await supabase
              .from('users')
              .select('email, full_name')
              .eq('id', order.user_id)
              .single()
            
            if (!userError && data) {
              userData = data
            }
          }

          return {
            ...order,
            user_email: userData?.email || 'Guest User',
            user_name: userData?.full_name || 'Guest User',
            // Ensure required fields have defaults
            payment_status: order.payment_status || 'unpaid',
            billing_address: order.billing_address || order.shipping_address || {
              full_name: 'N/A',
              address_line1: 'N/A',
              city: 'N/A',
              state: 'N/A',
              postal_code: 'N/A',
              country: 'N/A'
            },
            customer_phone : order.customer_phone || 'N/A',
            tracking_number: order.tracking_number || null
          }
        })
      )

      setOrders(ordersWithUserInfo)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        throw error
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }

      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'processing': return 'warning'
      case 'shipped': return 'info'
      case 'delivered': return 'success'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const getPaymentStatusBadgeVariant = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid': return 'success'
      case 'unpaid': return 'destructive'
      case 'refunded': return 'warning'
      default: return 'outline'
    }
  }

  // Filter orders based on search query, status filter, and active tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'recent' && new Date(order.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (activeTab === 'pending' && order.status === 'pending') ||
      (activeTab === 'processing' && order.status === 'processing') ||
      (activeTab === 'shipped' && order.status === 'shipped') ||
      (activeTab === 'delivered' && order.status === 'delivered') ||
      (activeTab === 'cancelled' && order.status === 'cancelled')
    
    return matchesSearch && matchesStatus && matchesTab
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  )

  // Generate pagination items
  const paginationItems = []
  for (let i = 1; i <= totalPages; i++) {
    // Show first page, last page, and pages around current page
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    } else if (
      i === currentPage - 2 ||
      i === currentPage + 2
    ) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground mt-1">View and manage customer orders</p>
          </div>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded-md"></div>
          <div className="h-64 bg-muted rounded-md"></div>
          <div className="h-12 bg-muted rounded-md"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground mt-1">View and manage customer orders</p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Tabs for quick filtering */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, email, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Orders</label>
              <div className="p-2 bg-muted rounded-md text-center font-semibold flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {filteredOrders.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{order.shipping_address.full_name}</span>
                          <span className="text-xs text-muted-foreground">{order.user_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status) as any}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusBadgeVariant(order.payment_status) as any}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-center">
                        <ShoppingCart className="h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-semibold">No orders found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                          {searchQuery || statusFilter !== 'all' || activeTab !== 'all'
                            ? 'Try adjusting your search or filters to find what you\'re looking for.'
                            : 'There are no orders in the system yet.'}
                        </p>
                        {(searchQuery || statusFilter !== 'all' || activeTab !== 'all') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSearchQuery('')
                              setStatusFilter('all')
                              setActiveTab('all')
                            }}
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={currentPage === 1 ? undefined : () => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {paginationItems}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={currentPage === totalPages ? undefined : () => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && isOrderDetailsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOrderDetailsOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" /> Customer Information
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <p><strong>Name:</strong> {selectedOrder.user_name}</p>
                      <p><strong>Email:</strong> {selectedOrder.user_email}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Order Information
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                      <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                      <p>
                        <strong>Status:</strong> 
                        <Badge variant={getStatusBadgeVariant(selectedOrder.status) as any} className="ml-2">
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </p>
                      <p>
                        <strong>Payment:</strong> 
                        <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.payment_status) as any} className="ml-2">
                          {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                        </Badge>
                      </p>
                      {selectedOrder.tracking_number && (
                        <p><strong>Tracking:</strong> {selectedOrder.tracking_number}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Order Items
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.total)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p>{selectedOrder.shipping_address.full_name}</p>
                      <p>{selectedOrder.shipping_address.address_line1}</p>
                      {selectedOrder.shipping_address.address_line2 && (
                        <p>{selectedOrder.shipping_address.address_line2}</p>
                      )}
                     
                      <p>{selectedOrder.customer_phone || 'N/A'}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
                  <Card>
                    <CardContent className="p-4">
                      {selectedOrder.billing_address ? (
                        <>
                          <p>{selectedOrder.billing_address.full_name}</p>
                          <p>{selectedOrder.billing_address.address_line1}</p>
                          {selectedOrder.billing_address.address_line2 && (
                            <p>{selectedOrder.billing_address.address_line2}</p>
                          )}
                        
                          <p>{selectedOrder.customer_phone}</p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Same as shipping address</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Update Order Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'pending')}
                    disabled={selectedOrder.status === 'pending'}
                  >
                    Pending
                  </Button>
                  <Button 
                    variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status === 'processing'}
                  >
                    Processing
                  </Button>
                  <Button 
                    variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={selectedOrder.status === 'shipped'}
                  >
                    Shipped
                  </Button>
                  <Button 
                    variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={selectedOrder.status === 'delivered'}
                  >
                    Delivered
                  </Button>
                  <Button 
                    variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}