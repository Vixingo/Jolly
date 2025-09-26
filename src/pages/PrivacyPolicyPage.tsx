import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We respect your privacy and are committed to protecting your personal data. This privacy policy 
              explains how we collect, use, and safeguard your information when you visit our website or make 
              a purchase from our store.
            </p>
            <p>
              This policy applies to all information collected or submitted on our website. By using our service, 
              you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Name and contact information (email, phone, address)</li>
                <li>• Payment information (processed securely through our payment providers)</li>
                <li>• Account credentials (username, password)</li>
                <li>• Order history and preferences</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• IP address and browser information</li>
                <li>• Device information and operating system</li>
                <li>• Website usage data and analytics</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Process and fulfill your orders</li>
                <li>• Communicate with you about your orders and account</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Improve our website and services</li>
                <li>• Send promotional emails (with your consent)</li>
                <li>• Prevent fraud and ensure security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties, 
              except in the following circumstances:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website and conducting business</li>
              <li>• <strong>Payment Processing:</strong> Payment information is shared with secure payment processors to complete transactions</li>
              <li>• <strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
              <li>• <strong>Business Transfers:</strong> In the event of a merger or acquisition, customer information may be transferred</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• SSL encryption for data transmission</li>
              <li>• Secure servers and databases</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited access to personal information</li>
              <li>• Employee training on data protection</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to 
              protect your personal information, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. 
              Cookies are small files stored on your device that help us:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Remember your preferences and settings</li>
              <li>• Keep you logged in to your account</li>
              <li>• Analyze website traffic and usage patterns</li>
              <li>• Provide personalized content and advertisements</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences. However, disabling 
              cookies may affect the functionality of our website.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li>• <strong>Portability:</strong> Request transfer of your data to another service provider</li>
              <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li>• <strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our service is not intended for children under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date. We encourage 
              you to review this policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email: privacy@yourstore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone: +1 (555) 123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}