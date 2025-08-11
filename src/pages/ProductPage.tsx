import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Package } from 'lucide-react'

export default function ProductPage() {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Product Page</h2>
            <p className="text-muted-foreground mb-4">
              Product ID: {id}
            </p>
            <p className="text-muted-foreground">
              This page will display detailed product information, images, and purchase options.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
