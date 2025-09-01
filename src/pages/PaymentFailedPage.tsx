import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface OrderDetails {
  id: string
  total: number
  status: string
  payment_status: string
  customer_phone?: string
  customer_email?: string
  payment_method?: string
  created_at: string
}

export default function PaymentFailedPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get('order_id')

  useEffect(() => {
    const processPaymentFailure = async () => {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        // Update order payment status to failed and order status to cancelled
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'unpaid',
            status: 'cancelled'
          })
          .eq('id', orderId)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating order:', updateError)
        } else {
          setOrderDetails(updatedOrder)
        }
      } catch (error) {
        console.error('Error processing payment failure:', error)
      } finally {
        setIsLoading(false)
      }
    }

    processPaymentFailure()
  }, [orderId])

  const handleRetryPayment = () => {
    // Navigate back to checkout to retry payment
    navigate('/checkout')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h2>
            <p className="text-gray-600">Please wait while we update your order.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Your order has been cancelled. Please try again or contact support if the problem persists.
          </p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-sm font-mono">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="text-sm font-semibold">৳{orderDetails.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="text-sm text-red-600 font-medium">Cancelled</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleRetryPayment}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Payment Again
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shopping
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <p className="text-sm text-gray-600">
              Contact our support team if you continue to experience issues with payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}