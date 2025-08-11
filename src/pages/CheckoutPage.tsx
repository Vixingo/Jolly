import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Checkout Page</h2>
            <p className="text-muted-foreground">
              This page will handle the checkout process with shipping and payment forms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
