import { Link } from 'react-router-dom'
import { 
  useStoreName, 
  useStoreLogo, 
  useStoreContact, 
  useStoreSocialLinks, 
  // useStorePolicies,
  useStoreSettings
} from '../../contexts/StoreSettingsContext'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Package
} from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

export default function Footer() {
  const storeName = useStoreName()
  const storeLogo = useStoreLogo()
  const { storeSettings } = useStoreSettings()
  const contact = useStoreContact()
  const socialLinks = useStoreSocialLinks()
  // const policies = useStorePolicies()

  const currentYear = new Date().getFullYear()

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    tiktok: MessageCircle // Using MessageCircle as TikTok icon placeholder
  }

  const activeSocialLinks = Object.entries(socialLinks)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => ({
      platform,
      url,
      Icon: socialIcons[platform as keyof typeof socialIcons]
    }))

  // const activePolicies = Object.entries(policies)
  //   .filter(([_, content]) => content && content.trim() !== '')
  //   .map(([type, content]) => ({
  //     type,
  //     content,
  //     label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  //   }))

  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {storeLogo ? (
                <img 
                  src={storeLogo} 
                  alt={storeName} 
                  className="h-8 w-auto max-w-[150px] object-contain"
                />
              ) : (
                <>
                  <Package className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">{storeName}</span>
                </>
              )}
            </div>
            {storeSettings?.store_description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {storeSettings.store_description}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3">
              {contact.email && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-foreground transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.whatsapp && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <a 
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
              {contact.address && (
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{contact.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <Link 
                to="/privacy" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/returns" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Return Policy
              </Link>
              <Link 
                to="/shipping" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Shipping Policy
              </Link>
              {/* {activePolicies.map(({ type, label }) => (
                <button
                  key={type}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  onClick={() => {
                    // You can implement a modal or separate page for policies
                    console.log(`Show ${label} policy`)
                  }}
                >
                  {label}
                </button>
              ))} */}
            </div>
          </div>

          {/* Social Media */}
          {activeSocialLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Follow Us</h3>
              <div className="flex flex-wrap gap-2">
                {activeSocialLinks.map(({ platform, url, Icon }) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-10 h-10 p-0"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${platform}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} {storeName}. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Powered by Jolly E-commerce</span>
          </div>
        </div>
      </div>
    </footer>
  )
}