import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { RefreshCw, Clock, Package, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <RefreshCw className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Return & Refund Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Important Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please read this return policy carefully before making a purchase. By purchasing from us, 
            you agree to the terms outlined in this policy.
          </AlertDescription>
        </Alert>

        {/* Return Window */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Return Window
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-600">Standard Returns</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>30 days</strong> from delivery date</li>
                  <li>• Items must be unused and in original condition</li>
                  <li>• Original packaging and tags required</li>
                  <li>• Return shipping costs apply</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-600">Defective Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>60 days</strong> from delivery date</li>
                  <li>• Free return shipping</li>
                  <li>• Full refund or replacement</li>
                  <li>• Photo evidence may be required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligible Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              What Can Be Returned
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-3">Returnable Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Unused items in original condition</li>
                  <li>• Items with original packaging and tags</li>
                  <li>• Non-personalized products</li>
                  <li>• Items purchased within return window</li>
                  <li>• Defective or damaged items</li>
                  <li>• Wrong items sent by mistake</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-3">Non-Returnable Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personalized or custom-made items</li>
                  <li>• Perishable goods</li>
                  <li>• Intimate or sanitary goods</li>
                  <li>• Items damaged by misuse</li>
                  <li>• Digital products or downloads</li>
                  <li>• Gift cards or vouchers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              How to Return Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold">Initiate Return</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our customer service or use your account dashboard to start a return request
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold">Pack & Ship</h3>
                <p className="text-sm text-muted-foreground">
                  Pack items securely in original packaging and ship using provided return label
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold">Get Refund</h3>
                <p className="text-sm text-muted-foreground">
                  Receive your refund within 5-10 business days after we process your return
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Return Instructions</h3>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Log into your account and go to "Order History"</li>
                <li>Find your order and click "Return Items"</li>
                <li>Select the items you want to return and provide a reason</li>
                <li>Print the prepaid return shipping label</li>
                <li>Pack items securely with all original materials</li>
                <li>Attach the return label and drop off at designated carrier</li>
                <li>Track your return using the provided tracking number</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Refund Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Refund Processing</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Refunds are processed to the original payment method</li>
              <li>• Processing time: 3-5 business days after we receive your return</li>
              <li>• Bank processing may take additional 5-10 business days</li>
              <li>• You'll receive an email confirmation when refund is processed</li>
            </ul>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Refund Amounts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Standard Returns</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Product price: Full refund</li>
                  <li>• Original shipping: Non-refundable</li>
                  <li>• Return shipping: Customer pays</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Defective/Wrong Items</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Product price: Full refund</li>
                  <li>• Original shipping: Full refund</li>
                  <li>• Return shipping: We pay</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchanges */}
        <Card>
          <CardHeader>
            <CardTitle>Exchanges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We currently do not offer direct exchanges. If you need a different size, color, or model, 
              please return the original item for a refund and place a new order for the desired item.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Why We Don't Offer Direct Exchanges</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Ensures you get the current best price</li>
                <li>• Allows you to use any available promotions or discounts</li>
                <li>• Provides better inventory accuracy</li>
                <li>• Faster processing times</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Return Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Return Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Costs</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">Free Return Shipping</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Defective or damaged items</li>
                  <li>• Wrong item sent by our mistake</li>
                  <li>• Orders over $100 (premium customers)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-orange-600">Customer Pays Shipping</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Change of mind returns</li>
                  <li>• Size or color exchanges</li>
                  <li>• Orders under $100</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Packaging Requirements</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Use original packaging when possible</li>
              <li>• Include all accessories, manuals, and free gifts</li>
              <li>• Pack items securely to prevent damage during transit</li>
              <li>• Include the return authorization number</li>
            </ul>
          </CardContent>
        </Card>

        {/* Special Circumstances */}
        <Card>
          <CardHeader>
            <CardTitle>Special Circumstances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Damaged in Transit</h3>
            <p>
              If your item arrives damaged, please contact us within 48 hours of delivery with photos 
              of the damage. We'll arrange for a replacement or full refund at no cost to you.
            </p>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Lost Returns</h3>
            <p>
              If your return package is lost in transit, we'll work with the shipping carrier to locate 
              it. Please keep your tracking number and shipping receipt until your refund is processed.
            </p>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">International Returns</h3>
            <p>
              International customers are responsible for return shipping costs and any customs fees. 
              Returns may take longer to process due to customs clearance.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have questions about returns or need assistance with your return, please contact our customer service team:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> returns@yourstore.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
              <p><strong>Live Chat:</strong> Available on our website during business hours</p>
            </div>
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm">
                <strong>Tip:</strong> Have your order number ready when contacting customer service 
                for faster assistance with your return.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}