import { MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useStoreContact } from '../../contexts/StoreSettingsContext'

interface WhatsAppButtonProps {
  message?: string
  className?: string
}

export default function WhatsAppButton({ 
  message = "Hi! I need help with my order.", 
  className = "" 
}: WhatsAppButtonProps) {
  const contact = useStoreContact()

  if (!contact.whatsapp) {
    return null
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = contact.whatsapp.replace(/[^0-9]/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  )
}

// Alternative inline version for use within components
export function InlineWhatsAppButton({ 
  message = "Hi! I have a question about this product.", 
  className = "" 
}: WhatsAppButtonProps) {
  const contact = useStoreContact()

  if (!contact.whatsapp) {
    return null
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = contact.whatsapp.replace(/[^0-9]/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant="outline"
      className={`bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 ${className}`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      WhatsApp Support
    </Button>
  )
}