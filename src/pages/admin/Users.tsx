import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select'
import { 
  Users, 
  Search, 
  Edit,
  Trash2,
  Shield,
  User,
  UserRound,
  Mail,
  Calendar,
  Plus,
  X
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import UserModal from '../../components/admin/UserModal'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'user' | 'customer'
  created_at?: string
}

interface UserFormData extends Omit<User, 'id' | 'created_at'> {
  password?: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users')
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = () => {
    setModalMode('create')
    setSelectedUser(null)
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setModalMode('edit')
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id)

      if (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
        return
      }

      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleSaveUser = async (userData: UserFormData) => {
    try {
      if (modalMode === 'create') {
        // Create user profile with only the available fields
        const newUser = {
          id: crypto.randomUUID(), // Generate a temporary ID
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role
        }

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single()

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          if (profileError.message.includes('row-level security policy')) {
            toast.error('Permission denied. You need to set up RLS policies for the users table.')
            toast.error('Check the README for database setup instructions.')
          } else {
            toast.error(`Failed to create user: ${profileError.message}`)
          }
          return
        }

        setUsers(prev => [profileData, ...prev])
        toast.success(`User profile created successfully! Note: User will need to sign up through the regular signup process to access the system.`)
      } else if (modalMode === 'edit' && selectedUser) {
        // Update user profile with only available fields
        const updateData = {
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role
        }
        
        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', selectedUser.id)
          .select()
          .single()

        if (error) {
          console.error('Error updating user:', error)
          toast.error('Failed to update user')
          return
        }

        setUsers(prev => prev.map(u => u.id === selectedUser.id ? data : u))
        toast.success('User updated successfully')
      }

      setIsUserModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error('Failed to save user')
    }
  }



  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })



  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleCreateUser} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* RLS Policy Notice */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Database Setup Required</h3>
              <p className="text-sm text-blue-700 mb-2">
                If you encounter "row-level security policy" errors, you need to set up the proper RLS policies in your Supabase database.
              </p>
              <p className="text-sm text-blue-700">
                Run the SQL from <code className="bg-blue-100 px-1 rounded">database-setup.sql</code> in your Supabase SQL Editor, 
                or check the README for detailed instructions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Users</span>
            </div>
            <div className="text-2xl font-bold mt-2">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Admins</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-purple-600 dark:text-purple-400">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Users</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">
              {users.filter(u => u.role === 'user').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Customers</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600 dark:text-green-400">
              {users.filter(u => u.role === 'customer').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="p-2 bg-muted rounded-md text-center font-semibold flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {filteredUsers.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Role</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Joined</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback className="bg-primary/10">
                            {user.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="sm:hidden mt-1">
                            <Badge 
                              variant="outline"
                              className={user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 
                                        user.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                                        'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'}
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <Shield className="h-3 w-3 mr-1" />
                                  Admin
                                </>
                              ) : user.role === 'user' ? (
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
                    </td>
                    
                    <td className="p-3 hidden sm:table-cell">
                      <Badge 
                        variant="outline"
                        className={user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 
                                  user.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                                  'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : user.role === 'user' ? (
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
                    </td>
                    
                    <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                {searchQuery || selectedRole !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first user'
                }
              </p>
              {searchQuery || selectedRole !== 'all' ? (
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('all');
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={handleCreateUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First User
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.full_name}"? This action cannot be undone.`}
      />
    </div>
  )
}
