import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function ThankYouPage() {
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
            <p className="text-muted-foreground">
              This page will display order confirmation and next steps.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
