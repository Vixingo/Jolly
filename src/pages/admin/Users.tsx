import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Users } from 'lucide-react'

export default function AdminUsers() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p className="text-muted-foreground">
              This page will allow admins to view and manage user accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
