'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  userId: string
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ userId, images, onChange, maxImages = 8 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remaining = maxImages - images.length
    const files = acceptedFiles.slice(0, remaining)
    if (!files.length) {
      toast.error(`Max ${maxImages} bilder tillåtna`)
      return
    }

    setUploading(true)
    const uploaded: string[] = []

    try {
      for (const file of files) {
        const ext = file.name.split('.').pop()
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error } = await supabase.storage
          .from('listing-images')
          .upload(path, file, { cacheControl: '3600', upsert: false })

        if (error) throw error

        const { data } = supabase.storage
          .from('listing-images')
          .getPublicUrl(path)

        uploaded.push(data.publicUrl)
      }

      onChange([...images, ...uploaded])
      toast.success(`${uploaded.length} bild${uploaded.length > 1 ? 'er' : ''} uppladdad${uploaded.length > 1 ? 'e' : ''}`)
    } catch (err) {
      toast.error('Kunde inte ladda upp bild. Försök igen.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }, [images, userId, maxImages, onChange, supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5 MB
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = async (url: string, index: number) => {
    // Extrahera sökväg från URL
    const path = url.split('/listing-images/')[1]
    if (path) {
      await supabase.storage.from('listing-images').remove([path])
    }
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-brand-400 bg-brand-50'
              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-wait' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Laddar upp...</p>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? 'Släpp bilderna här' : 'Dra och släpp bilder, eller klicka för att välja'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WEBP · Max 5 MB · {images.length}/{maxImages} bilder
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={url}
                alt={`Bild ${i + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
              {i === 0 && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="badge bg-brand-500 text-white text-[10px]">Omslagsbild</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(url, i)}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                aria-label="Ta bort bild"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
