import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import UserFileUploader from '../../components/admin/UserFileUploader'
import { listBuckets } from '../../lib/storage-utils'
import { Button } from '../../components/ui/button'
import { Loader2 } from 'lucide-react'

interface Bucket {
  name: string
  id: string
  created_at: string
  updated_at: string
  public: boolean
}

export default function FileUploads() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const handleFileUploaded = (url: string) => {
    setUploadedUrls(prev => [...prev, url])
  }
  
  const fetchBuckets = async () => {
    setIsLoading(true)
    try {
      const bucketsData = await listBuckets()
      setBuckets(bucketsData)
    } catch (error) {
      console.error('Error fetching buckets:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">File Uploads</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload to user-uploads Bucket</CardTitle>
            <CardDescription>
              Upload files to the user-uploads bucket in Supabase Storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UserFileUploader 
              onFileUploaded={handleFileUploaded}
              label="Upload Image"
              buttonText="Select Image"
              accept="image/*"
              folder="images"
            />
            
            <UserFileUploader 
              onFileUploaded={handleFileUploaded}
              label="Upload Document"
              buttonText="Select Document"
              accept=".pdf,.doc,.docx,.txt"
              folder="documents"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Storage Buckets</CardTitle>
            <CardDescription>
              View all available storage buckets in your Supabase project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={fetchBuckets} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : 'Refresh Buckets'}
            </Button>
            
            {buckets.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Public</th>
                      <th className="p-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buckets.map(bucket => (
                      <tr key={bucket.id} className="border-t">
                        <td className="p-2">{bucket.name}</td>
                        <td className="p-2">{bucket.public ? 'Yes' : 'No'}</td>
                        <td className="p-2">{new Date(bucket.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {isLoading ? 'Loading buckets...' : 'No buckets found. Click Refresh to load buckets.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {uploadedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Files uploaded during this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {uploadedUrls.map((url, index) => (
                <li key={index} className="break-all">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}