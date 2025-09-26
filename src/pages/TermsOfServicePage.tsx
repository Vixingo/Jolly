import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { FileText, Scale, AlertTriangle, CreditCard, Truck, RefreshCw } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <FileText className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to our e-commerce platform. These Terms of Service ("Terms") govern your use of our 
              website and services. By accessing or using our service, you agree to be bound by these Terms.
            </p>
            <p>
              If you disagree with any part of these terms, then you may not access the service. These Terms 
              apply to all visitors, users, and others who access or use the service.
            </p>
          </CardContent>
        </Card>

        {/* Definitions */}
        <Card>
          <CardHeader>
            <CardTitle>Definitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <strong>"Service"</strong> refers to the website and e-commerce platform operated by us.
              </div>
              <div>
                <strong>"You"</strong> refers to the individual accessing or using the service.
              </div>
              <div>
                <strong>"We," "Us," or "Our"</strong> refers to the company operating this service.
              </div>
              <div>
                <strong>"Products"</strong> refers to the goods and services available for purchase through our platform.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use of Service */}
        <Card>
          <CardHeader>
            <CardTitle>Use of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Eligibility</h3>
            <p>
              You must be at least 18 years old to use our service. By using our service, you represent 
              and warrant that you meet this age requirement.
            </p>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Account Registration</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• You must provide accurate and complete information when creating an account</li>
              <li>• You are responsible for maintaining the security of your account credentials</li>
              <li>• You must notify us immediately of any unauthorized use of your account</li>
              <li>• One person or legal entity may not maintain more than one account</li>
            </ul>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Prohibited Uses</h3>
            <p>You may not use our service:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>• To submit false or misleading information</li>
              <li>• To upload or transmit viruses or any other type of malicious code</li>
            </ul>
          </CardContent>
        </Card>

        {/* Products and Services */}
        <Card>
          <CardHeader>
            <CardTitle>Products and Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            <p>
              We strive to provide accurate product descriptions, images, and pricing. However, we do not 
              warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Pricing</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• All prices are subject to change without notice</li>
              <li>• Prices are displayed in the currency specified on the website</li>
              <li>• We reserve the right to refuse or cancel orders placed for products listed at incorrect prices</li>
              <li>• Additional fees such as taxes and shipping costs may apply</li>
            </ul>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Availability</h3>
            <p>
              All products are subject to availability. We reserve the right to discontinue any product at any time. 
              In the event that a product is unavailable after you have placed an order, we will notify you and 
              provide a full refund.
            </p>
          </CardContent>
        </Card>

        {/* Orders and Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Orders and Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Order Acceptance</h3>
            <p>
              Your receipt of an order confirmation does not signify our acceptance of your order, nor does it 
              constitute confirmation of our offer to sell. We reserve the right to accept or decline your order 
              for any reason at any time.
            </p>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Payment Terms</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Payment is due at the time of purchase</li>
              <li>• We accept major credit cards, debit cards, and other payment methods as displayed</li>
              <li>• All payments are processed securely through third-party payment processors</li>
              <li>• You authorize us to charge your payment method for the total amount of your order</li>
            </ul>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Order Cancellation</h3>
            <p>
              You may cancel your order within 24 hours of placement, provided the order has not yet been 
              processed or shipped. Once an order has been processed or shipped, it cannot be cancelled 
              but may be eligible for return according to our return policy.
            </p>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping and Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Shipping and delivery terms are outlined in our separate Shipping Policy. By placing an order, 
              you agree to the shipping terms and acknowledge that delivery times are estimates and not guarantees.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Risk of loss and title for products pass to you upon delivery to the carrier</li>
              <li>• You are responsible for providing accurate shipping information</li>
              <li>• Additional charges may apply for expedited shipping or special delivery requirements</li>
              <li>• We are not responsible for delays caused by shipping carriers or customs</li>
            </ul>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Returns and Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our return and refund policy is detailed in our separate Return Policy. Please review this 
              policy before making a purchase, as it outlines the conditions under which returns and 
              refunds are accepted.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Returns must be initiated within the specified time frame</li>
              <li>• Products must be in original condition for return eligibility</li>
              <li>• Refunds will be processed to the original payment method</li>
              <li>• Shipping costs are generally non-refundable unless the return is due to our error</li>
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The service and its original content, features, and functionality are and will remain the 
              exclusive property of our company and its licensors. The service is protected by copyright, 
              trademark, and other laws.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• You may not reproduce, distribute, modify, or create derivative works of our content</li>
              <li>• Our trademarks and trade dress may not be used without our prior written consent</li>
              <li>• You retain ownership of content you submit, but grant us a license to use it</li>
              <li>• We respect the intellectual property rights of others and expect users to do the same</li>
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Disclaimers and Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Disclaimer of Warranties</h3>
            <p>
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations 
              or warranties of any kind, express or implied, regarding the use or results of the service.
            </p>
            
            <Separator />
            
            <h3 className="text-lg font-semibold">Limitation of Liability</h3>
            <p>
              In no event shall our company, its directors, employees, or agents be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, loss of 
              profits, data, use, goodwill, or other intangible losses.
            </p>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card>
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You agree to defend, indemnify, and hold harmless our company and its licensee and licensors, 
              and their employees, contractors, agents, officers and directors, from and against any and all 
              claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but 
              not limited to attorney's fees).
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without 
              prior notice or liability, under our sole discretion, for any reason whatsoever, including 
              without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the service will cease immediately. If you wish to 
              terminate your account, you may simply discontinue using the service.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which our 
              company is located, without regard to its conflict of law provisions. Any disputes arising 
              from these Terms will be resolved in the courts of that jurisdiction.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms 
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p>Email: legal@yourstore.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}