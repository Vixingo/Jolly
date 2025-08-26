import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useStoreCurrency } from '../contexts/StoreSettingsContext'
import { getCurrencySymbol } from './store-settings'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Format currency with specific currency code
export function formatCurrencyWithCode(amount: number, currencyCode: string): string {
  try {
    // Try using Intl.NumberFormat first
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
    
    // For BDT, Intl.NumberFormat might not show the correct symbol
    // So we need to check and replace if necessary
    if (currencyCode === 'BDT' && !formatted.includes('৳')) {
      // Fall back to our custom formatting for BDT
      return `৳${amount.toFixed(2)}`
    }
    
    return formatted
  } catch (error) {
    // Fallback to custom formatting if Intl.NumberFormat fails
    const symbol = getCurrencySymbol(currencyCode)
    return `${symbol}${amount.toFixed(2)}`
  }
}

// Custom hook to format currency using store settings
export function useFormatCurrency() {
  const currency = useStoreCurrency()
  return (amount: number) => formatCurrencyWithCode(amount, currency)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}
