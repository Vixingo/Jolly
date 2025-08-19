import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { z } from 'zod'
import { clearCart } from '../store/slices/cartSlice'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string()
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length <= 11;
      },
      {
        message: 'Phone number cannot exceed 11 digits'
      }
    )
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length === 11;
      },
      {
        message: 'Phone number must be exactly 11 digits'
      }
    ),
  address: z.string().min(10, 'Please enter a complete address')
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector(state => state.cart)
  const { user } = useAppSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phoneNumber: '',
    address: ''
  })

  const validateField = (field: keyof CheckoutFormData, value: string) => {
    try {
      checkoutSchema.shape[field].parse(value)
      setErrors(prev => ({ ...prev, [field]: undefined }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0].message }))
      }
      return false
    }
  }

  // Add delivery charge to total
  const deliveryCharge = 150
  const finalTotal = total + deliveryCharge

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check for empty fields and show specific messages
    const emptyFields: string[] = []
    if (!formData.fullName) emptyFields.push('Full Name')
    if (!formData.phoneNumber) emptyFields.push('Phone Number')
    if (!formData.address) emptyFields.push('Shipping Address')

    if (emptyFields.length > 0) {
      toast.error(`Please fill in: ${emptyFields.join(', ')}`)
      return
    }

    // Validate all fields
    const isValid = Object.entries(formData).every(([field, value]) => 
      validateField(field as keyof CheckoutFormData, value)
    )

    if (!isValid) {
      toast.error('Please fix the form errors')
      return
    }

    try {
      setIsLoading(true)

      const orderDetails = {
        user_id: user?.id || null,
        total: finalTotal, // This already includes the delivery charge
        items: items,
        shipping_address: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address
        },
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([orderDetails])
        .select()
        .single()

      if (error) throw error

      // Clear the cart after successful order placement
      dispatch(clearCart())
      
      toast.success('Order placed successfully!')
      navigate('/thank-you', { state: { orderDetails: data } })
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4">
        {/* Shipping Information Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      const digitsOnly = value.replace(/\D/g, '');
                      if (digitsOnly.length <= 11) {
                        handleFieldChange('phoneNumber', value);
                      }
                    }}
                    className={`mt-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Shipping Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="Enter your complete shipping address"
                  rows={3}
                />
              </div>

              {/* Order Summary Section */}
              <div className="mt-6 p-3 bg-muted rounded-lg">
                <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                            {item.quantity}
                          </div>
                        </div>
                        <span className="font-medium truncate max-w-[150px]">{item.name}</span>
                      </div>
                      <span>{new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      }).format(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      }).format(total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Charge</span>
                      <span>{new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      }).format(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg mt-2">
                      <span>Total</span>
                      <span>{new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                      }).format(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button - Fixed on mobile */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:relative md:p-0 md:border-0 md:bg-transparent">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-[jiggle_6s_ease-in-out_infinite]" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Place Order - ${new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                  }).format(finalTotal)}`}
                </Button>
              </div>

      <style>{`
        @keyframes jiggle {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          2%, 8% { transform: translate3d(-4px, 0, 0) scale(1.02); }
          4%, 6% { transform: translate3d(8px, 0, 0) scale(1.02); }
          15%, 85% { transform: translate3d(0, 0, 0) scale(1); }
          87%, 93% { transform: translate3d(-4px, 0, 0) scale(1.02); }
          89%, 91% { transform: translate3d(8px, 0, 0) scale(1.02); }
        }
      `}</style>
            </form>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  )
}
