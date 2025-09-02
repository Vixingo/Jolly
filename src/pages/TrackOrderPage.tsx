import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Loader2, Package, Search } from 'lucide-react'

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
}

interface OrderDetails {
  id: string
  total: number
  status: string
  payment_status: string
  items: OrderItem[]
  shipping_address: Address
  billing_address?: Address
  tracking_number?: string
  customer_phone?: string
  customer_email?: string
  payment_method?: string
  created_at: string
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderId.trim()) {
      toast.error('Please enter an order ID')
      return
    }

    setIsLoading(true)
    setError('')
    setOrderDetails(null)

    try {
      // Fetch order details by ID
      const { data, error } = await supabase
        .from('orders')
        .select('*, items(*)')
        .eq('id', orderId)
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        setError('Order not found. Please check your order ID and try again.')
        return
      }

      setOrderDetails(data)
      toast.success('Order found!')
    } catch (error) {
      console.error('Error tracking order:', error)
      setError('Failed to find order. Please check your order ID and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'unpaid':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Order
          </CardTitle>
          <CardDescription>
            Enter your order ID to track your order status and details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                'Track Order'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center text-red-800">
            {error}
          </CardContent>
        </Card>
      )}

      {orderDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order #{orderDetails.id.slice(0, 8)}
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(orderDetails.status)}`}>
                {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
              </span>
            </CardTitle>
            <CardDescription>
              Placed on {formatDate(orderDetails.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div>
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderDetails.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">{item.product_name}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td colSpan={3} className="px-4 py-3 text-right font-bold">Total:</td>
                      <td className="px-4 py-3 text-right font-bold">{formatCurrency(orderDetails.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Order Status:</span> 
                    <span className={`ml-2 px-2 py-0.5 rounded ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                    </span>
                  </p>
                  <p><span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-0.5 rounded ${getPaymentStatusColor(orderDetails.payment_status)}`}>
                      {orderDetails.payment_status.charAt(0).toUpperCase() + orderDetails.payment_status.slice(1)}
                    </span>
                  </p>
                  {orderDetails.payment_method && (
                    <p><span className="font-medium">Payment Method:</span> {orderDetails.payment_method.toUpperCase()}</p>
                  )}
                  {orderDetails.tracking_number && (
                    <p><span className="font-medium">Tracking Number:</span> {orderDetails.tracking_number}</p>
                  )}
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="space-y-1 text-sm">
                  <p>{orderDetails.shipping_address.full_name}</p>
                  <p>{orderDetails.shipping_address.address_line1}</p>
                  {orderDetails.shipping_address.address_line2 && (
                    <p>{orderDetails.shipping_address.address_line2}</p>
                  )}
                  <p>
                    {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.postal_code}
                  </p>
                  <p>{orderDetails.shipping_address.country}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}