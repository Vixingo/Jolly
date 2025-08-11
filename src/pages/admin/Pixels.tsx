import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Code, Plus } from 'lucide-react'

export default function AdminPixels() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pixel & Tag Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Pixel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tracking Pixels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Pixel Management</h2>
            <p className="text-muted-foreground">
              This page will allow admins to configure Google Analytics, Facebook Pixel, and custom tracking codes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
