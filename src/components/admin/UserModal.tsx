import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { X, User, Mail, Shield, Users } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'user' | 'customer'
  created_at?: string
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (userData: Omit<User, 'id' | 'created_at'> & { password?: string }) => void
  user: User | null
  mode: 'create' | 'edit'
}

interface FormData {
  email: string
  full_name: string
  password: string
  role: User['role']
}

const ROLES = [
  { value: 'user', label: 'User', description: 'Regular user with limited access' },
  { value: 'admin', label: 'Admin', description: 'Full administrative access' }
]



export default function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    full_name: '',
    password: '',
    role: 'user'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        email: user.email,
        full_name: user.full_name,
        password: '', // No password for editing
        role: user.role
      })
    } else {
      setFormData({
        email: '',
        full_name: '',
        password: '',
        role: 'user'
      })
    }
    setErrors({})
  }, [user, mode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }





    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const userData = {
        email: formData.email.trim().toLowerCase(),
        full_name: formData.full_name.trim(),
        role: formData.role
      }

      await onSave(userData)
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {mode === 'create' ? 'Add New User' : 'Edit User'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={`pl-10 ${errors.full_name ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>

            {/* Note for new users */}
            {mode === 'create' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This creates a user profile. The user will need to sign up through the regular signup process to access the system.
                </p>
              </div>
            )}



            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {ROLES.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            {/* Preview */}
            {formData.full_name && (
              <div className="space-y-2">
                <Label>User Preview</Label>
                <Card className="p-4">
                  <div className="flex items-center space-x-4">
                                         <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                       <span className="text-2xl font-medium">
                         {formData.full_name.charAt(0).toUpperCase()}
                       </span>
                     </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{formData.full_name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {formData.email}
                      </p>
                                             <div className="flex items-center space-x-4 mt-2">
                         <Badge 
                           variant={formData.role === 'admin' ? 'default' : 'secondary'}
                           className={formData.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                     formData.role === 'user' ? 'bg-blue-100 text-blue-800' : 
                                     'bg-green-100 text-green-800'}
                         >
                           {formData.role === 'admin' ? (
                             <>
                               <Shield className="h-3 w-3 mr-1" />
                               Admin
                             </>
                           ) : formData.role === 'user' ? (
                             <>
                               <User className="h-3 w-3 mr-1" />
                               User
                             </>
                           ) : (
                             <>
                               <Users className="h-3 w-3 mr-1" />
                               Customer
                             </>
                           )}
                         </Badge>
                       </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
