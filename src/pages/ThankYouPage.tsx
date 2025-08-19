import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { CheckCircle, Package } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface OrderDetails {
  id: string
  total: number
  status: string
  shipping_address: {
    fullName: string
    phoneNumber: string
    address: string
  }
}

export default function ThankYouPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // If no order details in location state, redirect to home
    if (!location.state?.orderDetails) {
      navigate('/')
      return
    }
    setOrderDetails(location.state.orderDetails)
  }, [])

  if (!orderDetails) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Order Confirmed</h2>
            <p className="text-muted-foreground mb-8">
              Your order has been placed successfully. We'll send you an email with the order details.
            </p>
            
            <div className="max-w-md mx-auto text-left bg-muted/30 p-6 rounded-lg">
              <h3 className="font-medium mb-4">Order Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Order ID:</span> {orderDetails.id}</p>
                <p><span className="font-medium">Status:</span> {orderDetails.status}</p>
                <p><span className="font-medium">Total:</span> {formatCurrency(orderDetails.total)}</p>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Shipping Details</h4>
                  <p>{orderDetails.shipping_address.fullName}</p>
                  <p>{orderDetails.shipping_address.phoneNumber}</p>
                  <p className="whitespace-pre-line">{orderDetails.shipping_address.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button onClick={() => navigate('/')} className="mx-2">
                Continue Shopping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
