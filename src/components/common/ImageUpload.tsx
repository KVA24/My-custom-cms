"use client"

import type React from "react"
import {useCallback, useRef, useState} from "react"
import {AlertCircle, CheckCircle2, Loader2, Upload, X} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {apiClient} from "@/lib/api"
import toastUtil from "@/lib/toastUtil.ts";

interface ImageUploadProps {
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  accept?: string
  uploadUrl?: string
  className?: string
  disabled?: boolean
}

interface UploadedFile {
  id: string
  file: File
  preview: string
  progress: number
  status: "uploading" | "success" | "error"
  url?: string
  error?: string
}

const ImageUpload = ({
                       value,
                       onChange,
                       multiple = false,
                       maxFiles = 5,
                       maxSize = 5,
                       accept = "image/*",
                       uploadUrl = "/v1/portal/images/upload/static",
                       className,
                       disabled = false,
                     }: ImageUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileSelect = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return
      
      const fileArray = Array.from(selectedFiles)
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          return false
        }
        if (file.size > maxSize * 1024 * 1024) {
          toastUtil.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB`)
          return false
        }
        return true
      })
      
      if (!multiple && validFiles.length > 0) {
        setFiles([])
      }
      
      const newFiles: UploadedFile[] = validFiles.slice(0, multiple ? maxFiles : 1).map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
      }))
      
      setFiles((prev) => [...prev, ...newFiles])
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
      // Upload files
      for (const uploadFile of newFiles) {
        try {
          const response = await apiClient.upload(uploadUrl, uploadFile.file, "image_url", undefined, {
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.loaded / (progressEvent.total || 1)
              setFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? {...f, progress: Math.round(progress * 100)} : f)),
              )
            },
          })
          
          if (response.success) {
            const url = response.data?.url || response.data
            setFiles((prev) =>
              prev.map((f) => {
                if (f.id === uploadFile.id) {
                  if (f.preview) URL.revokeObjectURL(f.preview)
                  return {...f, status: "success", url, progress: 100}
                }
                return f
              }),
            )
            
            // Call onChange with the uploaded URL
            if (onChange) {
              if (multiple) {
                const urls = [...(Array.isArray(value) ? value : []), url.img_url || url]
                onChange(urls)
              } else {
                onChange(url.img_url || url)
              }
            }
          } else {
            throw new Error(response.message || "Upload failed")
          }
        } catch (error: any) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? {...f, status: "error", error: error.message || "Upload failed"} : f,
            ),
          )
        }
      }
    },
    [multiple, maxFiles, maxSize, uploadUrl, onChange, value],
  )
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (!disabled) {
        handleFileSelect(e.dataTransfer.files)
      }
    },
    [disabled, handleFileSelect],
  )
  
  const handleRemove = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const removed = prev.find((f) => f.id === id)
        if (removed?.preview) {
          URL.revokeObjectURL(removed.preview)
        }
        return prev.filter((f) => f.id !== id)
      })
      
      // Update value
      if (onChange) {
        const removedFile = files.find((f) => f.id === id)
        if (removedFile?.url) {
          if (multiple && Array.isArray(value)) {
            onChange(value.filter((url) => url !== removedFile.url))
          } else {
            onChange("")
          }
        }
      }
    },
    [files, onChange, value, multiple],
  )
  
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragging && "border-primary bg-primary/10 scale-[1.02]",
          disabled && "opacity-50 cursor-not-allowed",
          !isDragging && "border-border",
        )}
      >
        {multiple ? (
          <div className="p-8 text-center">
            <div
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary"/>
            </div>
            <h3 className="text-lg font-semibold mb-2">{isDragging ? "Drop here" : "Upload"}</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag or click to upload</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Maximum {maxSize}MB</span>
              {multiple && <span>• Tối đa {maxFiles} ảnh</span>}
            </div>
          </div>
        ) : (
          <div className="p-2 text-center flex flex-col items-center justify-center gap-1">
            <h3 className="text-lg font-semibold">{isDragging ? "Drop here" : "Upload"}</h3>
            <p className="text-sm text-muted-foreground">Drag or click to upload</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Maximum {maxSize}MB</span>
              {multiple && <span>• Tối đa {maxFiles} ảnh</span>}
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-card"
            >
              {/* Image Preview */}
              <img
                src={file.url || file.preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              
              {/* Status Indicator */}
              <div className="absolute top-2 right-2 z-10">
                {file.status === "uploading" && (
                  <div className="bg-background/90 backdrop-blur-sm rounded-full p-1.5">
                    <Loader2 className="w-4 h-4 text-primary animate-spin"/>
                  </div>
                )}
                {file.status === "success" && (
                  <div className="bg-success/90 backdrop-blur-sm rounded-full p-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white"/>
                  </div>
                )}
                {file.status === "error" && (
                  <div className="bg-destructive/90 backdrop-blur-sm rounded-full p-1.5">
                    <AlertCircle className="w-4 h-4 text-white"/>
                  </div>
                )}
              </div>
              
              {/* Remove Button */}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(file.id)
                }}
              >
                <X className="w-4 h-4"/>
              </Button>
              
              {/* Progress Bar */}
              {file.status === "uploading" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{width: `${file.progress}%`}}
                  />
                </div>
              )}
              
              {/* Error Message */}
              {file.status === "error" && file.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-destructive/90 backdrop-blur-sm p-2">
                  <p className="text-xs text-white text-center truncate">{file.error}</p>
                </div>
              )}
              
              {/* File Name */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-white text-center truncate">{file.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State for existing images */}
      {files.length === 0 && value && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Array.isArray(value) ? value : [value]).map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-card"
            >
              <img
                src={url || "/placeholder.svg"}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
