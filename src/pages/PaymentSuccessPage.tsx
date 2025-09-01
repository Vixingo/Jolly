import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { handleInvoiceRequest } from '@/lib/emailService'
import { toast } from 'sonner'

interface OrderDetails {
  id: string
  total: number
  status: string
  payment_status: string
  customer_phone?: string
  customer_email?: string
  payment_method?: string
  invoice_requested?: boolean
  invoice_email?: string
  created_at: string
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get('order_id')

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (!orderId) {
        setError('Order ID not found')
        setIsLoading(false)
        return
      }

      try {
        // Update order payment status to paid
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', orderId)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating order:', updateError)
          setError('Failed to update order status')
          return
        }

        setOrderDetails(updatedOrder)

        // Handle invoice request if needed
        if (updatedOrder.invoice_requested && updatedOrder.invoice_email) {
          try {
            await handleInvoiceRequest(orderId)
            toast.success('Invoice sent to your email!')
          } catch (invoiceError) {
            console.error('Error sending invoice:', invoiceError)
            toast.error('Payment successful, but failed to send invoice')
          }
        }

        toast.success('Payment completed successfully!')
      } catch (error) {
        console.error('Error processing payment success:', error)
        setError('Failed to process payment')
      } finally {
        setIsLoading(false)
      }
    }

    processPaymentSuccess()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => navigate('/checkout')} 
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your order has been confirmed.
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
                  <span className="text-sm text-green-600 font-medium">Paid</span>
                </div>
                {orderDetails.invoice_requested && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Invoice:</span>
                    <span className="text-sm text-blue-600">Sent to email</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/thank-you', { state: { orderDetails } })} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View Order Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}