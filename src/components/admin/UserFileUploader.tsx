import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { uploadUserFile } from '../../lib/storage-utils'

interface UserFileUploaderProps {
  onFileUploaded?: (url: string) => void
  label?: string
  buttonText?: string
  accept?: string
  folder?: string
}

/**
 * A reusable component for uploading files to the user-uploads bucket
 */
export default function UserFileUploader({
  onFileUploaded,
  label = 'Upload File',
  buttonText = 'Select File',
  accept = 'image/*',
  folder = 'uploads'
}: UserFileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    
    try {
      const file = files[0]
      
      // Create a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      
      // Upload the file
      const publicUrl = await uploadUserFile(filePath, file)
      
      if (publicUrl) {
        setUploadedUrl(publicUrl)
        onFileUploaded?.(publicUrl)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          className="relative overflow-hidden"
        >
          {isUploading ? 'Uploading...' : buttonText}
          <Input
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
        
        {uploadedUrl && (
          <div className="text-sm text-muted-foreground">
            File uploaded successfully!
          </div>
        )}
      </div>
      
      {uploadedUrl && accept.includes('image/') && (
        <div className="mt-4">
          <img 
            src={uploadedUrl} 
            alt="Uploaded file" 
            className="max-w-xs max-h-40 object-contain rounded-md border"
          />
        </div>
      )}
    </div>
  )
}