import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Truck, Clock, MapPin, Package,   AlertCircle, Globe } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Truck className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Shipping Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Important Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please review our shipping policy carefully. Shipping times and costs may vary based on 
            your location and the items ordered.
          </AlertDescription>
        </Alert>

        {/* Shipping Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-green-600">Standard Shipping</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Cost:</strong> $5.99 (Free over $50)</p>
                  <p><strong>Time:</strong> 5-7 business days</p>
                  <p><strong>Tracking:</strong> Included</p>
                  <p><strong>Insurance:</strong> Up to $100</p>
                </div>
              </div>
              <div className="space-y-3 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-blue-600">Express Shipping</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Cost:</strong> $12.99</p>
                  <p><strong>Time:</strong> 2-3 business days</p>
                  <p><strong>Tracking:</strong> Real-time updates</p>
                  <p><strong>Insurance:</strong> Up to $500</p>
                </div>
              </div>
              <div className="space-y-3 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-purple-600">Overnight Shipping</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Cost:</strong> $24.99</p>
                  <p><strong>Time:</strong> Next business day</p>
                  <p><strong>Tracking:</strong> Real-time updates</p>
                  <p><strong>Insurance:</strong> Up to $1,000</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Free Shipping Eligibility</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Orders over $50 qualify for free standard shipping</li>
                <li>• Applies to continental US addresses only</li>
                <li>• Some oversized items may have additional fees</li>
                <li>• Promotional free shipping may have different terms</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Processing & Handling Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Standard Processing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>1-2 business days</strong> for in-stock items</li>
                  <li>• Orders placed before 2 PM EST ship same day</li>
                  <li>• Weekend orders processed on Monday</li>
                  <li>• Holiday processing may be delayed</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Special Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>3-5 business days</strong> for custom items</li>
                  <li>• <strong>5-10 business days</strong> for made-to-order</li>
                  <li>• <strong>2-3 weeks</strong> for personalized items</li>
                  <li>• Backorder items: varies by availability</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What Happens After You Order</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-medium text-sm">Order Received</h4>
                  <p className="text-xs text-muted-foreground">Confirmation email sent</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-medium text-sm">Processing</h4>
                  <p className="text-xs text-muted-foreground">Items picked & packed</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-medium text-sm">Shipped</h4>
                  <p className="text-xs text-muted-foreground">Tracking info provided</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold text-sm">4</span>
                  </div>
                  <h4 className="font-medium text-sm">Delivered</h4>
                  <p className="text-xs text-muted-foreground">Package arrives</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Zones & Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600">Domestic Shipping (US)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Continental US</span>
                    <span className="font-medium">Standard rates apply</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Alaska & Hawaii</span>
                    <span className="font-medium">+$10 surcharge</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>US Territories</span>
                    <span className="font-medium">Contact for rates</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600">International Shipping</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Canada</span>
                    <span className="font-medium">$15.99+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Europe</span>
                    <span className="font-medium">$25.99+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Other Countries</span>
                    <span className="font-medium">Contact for quote</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                International orders may be subject to customs duties, taxes, and fees determined by 
                the destination country. These charges are the responsibility of the recipient.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Package Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Packaging Standards</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• All items are carefully packaged to prevent damage during transit</li>
              <li>• Fragile items receive extra protective packaging at no additional cost</li>
              <li>• Eco-friendly packaging materials used whenever possible</li>
              <li>• Multiple items may be combined into one package when practical</li>
            </ul>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Size & Weight Restrictions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Standard Packages</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Maximum weight: 50 lbs</li>
                  <li>• Maximum dimensions: 36" x 24" x 24"</li>
                  <li>• Standard shipping rates apply</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Oversized Items</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Weight over 50 lbs or large dimensions</li>
                  <li>• Additional handling fees may apply</li>
                  <li>• Special shipping arrangements required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking & Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking & Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Order Tracking</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Tracking information provided via email once your order ships</li>
              <li>• Track your package on our website or the carrier's website</li>
              <li>• Real-time updates for Express and Overnight shipping</li>
              <li>• SMS notifications available upon request</li>
            </ul>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Delivery Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Delivery Requirements</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Signature may be required for high-value items</li>
                  <li>• Someone must be available to receive the package</li>
                  <li>• Valid street address required (no P.O. boxes for some items)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Delivery Attempts</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Carriers typically make 3 delivery attempts</li>
                  <li>• Package held at local facility after failed attempts</li>
                  <li>• Customer pickup or redelivery may be arranged</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Shipping Services */}
        <Card>
          <CardHeader>
            <CardTitle>Special Shipping Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-600">White Glove Delivery</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Available for large or fragile items</li>
                  <li>• Inside delivery and setup included</li>
                  <li>• Appointment scheduling required</li>
                  <li>• Additional fees apply</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-orange-600">Gift Services</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Gift wrapping available for $4.99</li>
                  <li>• Gift messages included at no charge</li>
                  <li>• Direct shipping to recipient</li>
                  <li>• Gift receipts provided</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Common Issues</h3>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h4 className="font-medium">Delayed Shipments</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Weather, holidays, or high volume may cause delays. We'll notify you of any 
                  significant delays and provide updated delivery estimates.
                </p>
              </div>
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h4 className="font-medium">Lost or Damaged Packages</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact us immediately if your package is lost or arrives damaged. We'll work 
                  with the carrier to resolve the issue and arrange a replacement or refund.
                </p>
              </div>
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-medium">Incorrect Address</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact us within 1 hour of placing your order to change the shipping address. 
                  Address changes after shipping may incur additional fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Have questions about shipping or need to track your order? Our shipping support team is here to help:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> shipping@yourstore.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 8 AM - 8 PM EST</p>
              <p><strong>Live Chat:</strong> Available on our website 24/7</p>
            </div>
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm">
                <strong>Quick Tip:</strong> Have your order number and tracking information ready 
                when contacting support for faster assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}