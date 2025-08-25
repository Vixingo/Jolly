import { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
  disabled?: boolean
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#64748b', // Slate
  '#374151', // Gray
  '#1f2937', // Dark Gray
  '#000000', // Black
]

export function ColorPicker({ value, onChange, label, className, disabled }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue)
    }
  }

  const handleInputBlur = () => {
    // If invalid format, revert to current value
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(value)
    }
  }

  const handlePresetClick = (color: string) => {
    setInputValue(color)
    onChange(color)
    setIsOpen(false)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-2"
              style={{ backgroundColor: value }}
              disabled={disabled}
              aria-label="Open color picker"
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Preset Colors</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded border-2 transition-all hover:scale-110",
                        value === color ? "border-foreground" : "border-border"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Custom Color</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => {
                      const newColor = e.target.value
                      setInputValue(newColor)
                      onChange(newColor)
                    }}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="#000000"
                    className="flex-1 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="#000000"
          className="flex-1 font-mono"
          maxLength={7}
          disabled={disabled}
        />
      </div>
    </div>
  )
}