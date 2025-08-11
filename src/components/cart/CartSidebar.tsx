import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCartOpen } from '../../store/slices/uiSlice'
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { 
  X, 
  Plus, 
  Minus, 
  Trash2,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../lib/utils'

export default function CartSidebar() {
  const dispatch = useAppDispatch()
  const { cartOpen } = useAppSelector(state => state.ui)
  const { items, total, itemCount } = useAppSelector(state => state.cart)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  if (!cartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(setCartOpen(false))}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              {itemCount > 0 && (
                <Badge variant="secondary">{itemCount}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setCartOpen(false))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add some products to get started
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-3">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          if (!isNaN(value)) {
                            handleQuantityChange(item.id, value)
                          }
                        }}
                        className="h-6 w-12 text-center text-xs"
                        min="1"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <Separator />
              
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatCurrency(total)}</span>
              </div>
              
              {/* Checkout Button */}
              <Button 
                asChild 
                className="w-full"
                size="lg"
              >
                <Link to="/checkout" onClick={() => dispatch(setCartOpen(false))}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              {/* Continue Shopping */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => dispatch(setCartOpen(false))}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
