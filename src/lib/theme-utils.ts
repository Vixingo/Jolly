// Utility functions for dynamic theme color management

// Convert hex color to HSL values for CSS variables
export function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace('#', '')
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  
  // Convert to degrees and percentages
  const hDeg = Math.round(h * 360)
  const sPercent = Math.round(s * 100)
  const lPercent = Math.round(l * 100)
  
  return `${hDeg} ${sPercent}% ${lPercent}%`
}

// Generate foreground color based on background lightness
export function generateForegroundColor(hex: string): string {
  // Remove the hash if present
  hex = hex.replace('#', '')
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return white for dark colors, dark for light colors
  return luminance > 0.5 ? '222.2 84% 4.9%' : '210 40% 98%'
}

// Apply theme colors to CSS variables
export function applyThemeColors(colors: {
  primary?: string
  secondary?: string
  accent?: string
}) {
  const root = document.documentElement
  
  if (colors.primary) {
    const primaryHsl = hexToHsl(colors.primary)
    const primaryForeground = generateForegroundColor(colors.primary)
    
    root.style.setProperty('--primary', primaryHsl)
    root.style.setProperty('--primary-foreground', primaryForeground)
    root.style.setProperty('--ring', primaryHsl) // Use primary color for focus rings
  }
  
  if (colors.secondary) {
    const secondaryHsl = hexToHsl(colors.secondary)
    const secondaryForeground = generateForegroundColor(colors.secondary)
    
    root.style.setProperty('--secondary', secondaryHsl)
    root.style.setProperty('--secondary-foreground', secondaryForeground)
  }
  
  if (colors.accent) {
    const accentHsl = hexToHsl(colors.accent)
    const accentForeground = generateForegroundColor(colors.accent)
    
    root.style.setProperty('--accent', accentHsl)
    root.style.setProperty('--accent-foreground', accentForeground)
  }
}

// Reset theme colors to default
export function resetThemeColors() {
  const root = document.documentElement
  
  // Light mode defaults
  root.style.setProperty('--primary', '221.2 83.2% 53.3%')
  root.style.setProperty('--primary-foreground', '210 40% 98%')
  root.style.setProperty('--secondary', '210 40% 96%')
  root.style.setProperty('--secondary-foreground', '222.2 84% 4.9%')
  root.style.setProperty('--accent', '210 40% 96%')
  root.style.setProperty('--accent-foreground', '222.2 84% 4.9%')
  root.style.setProperty('--ring', '221.2 83.2% 53.3%')
}

// Get default theme colors
export const DEFAULT_THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b', 
  accent: '#f59e0b'
}