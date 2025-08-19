import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
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
    if (!location.state?.orderDetails) {
      navigate('/')
      return
    }
    setOrderDetails(location.state.orderDetails)
  }, [])

  if (!orderDetails) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="text-center pb-0 pt-8 sm:pt-10 px-4 sm:px-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Thank You!</CardTitle>
          <p className="mt-2 text-base sm:text-lg text-gray-600 px-2">
            Your order has been placed successfully
          </p>
        </CardHeader>
        <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="font-mono mt-1">{orderDetails.id}</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    {orderDetails.status}
                  </p>
                </div>
                <div className="col-span-full bg-white/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(orderDetails.total)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 px-1">Shipping Details</h4>
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-3">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-gray-900 font-medium">{orderDetails.shipping_address.fullName}</p>
                  <p className="text-gray-600 mt-1">{orderDetails.shipping_address.phoneNumber}</p>
                  <p className="text-gray-600 whitespace-pre-line mt-2">{orderDetails.shipping_address.address}</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 sm:pt-6">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-all duration-200 hover:gap-3"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
