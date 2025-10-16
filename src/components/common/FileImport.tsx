"use client"

import type React from "react"
import {useRef, useState} from "react"
import {AlertCircle, CheckCircle2, FileText, ImportIcon, Loader2, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import apiClient from "@/lib/api"
import toastUtil from "@/lib/toastUtil.ts";

interface FileImportProps {
  onFileSelect?: (file: File) => void
  onUploadComplete?: (response: any) => void
  onUploadError?: (error: any) => void
  uploadUrl?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
  buttonText?: string
  buttonVariant?: "primary" | "outline" | "secondary" | "ghost"
  showPreview?: boolean
}

interface FileState {
  file: File | null
  progress: number
  status: "idle" | "uploading" | "success" | "error"
  error?: string
  response?: any
}

export function FileImport({
                             onFileSelect,
                             onUploadComplete,
                             onUploadError,
                             uploadUrl,
                             accept = ".xlsx,.xls,.doc,.docx,.pdf,.csv,.txt",
                             maxSize = 10,
                             className,
                             buttonText = "Import",
                             buttonVariant = "primary",
                             showPreview = true,
                           }: FileImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    progress: 0,
    status: "idle",
  })
  
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    const allowedTypes = accept.split(",").map((type) => type.trim().toLowerCase())
    const fileExt = "." + (file.name.split(".").pop() || "").toLowerCase()
    const fileMime = file.type.toLowerCase()
    
    const isAccepted =
      allowedTypes.includes(fileExt) ||
      allowedTypes.includes(fileMime) ||
      allowedTypes.includes("*/*")
    
    if (!isAccepted) {
      toastUtil.error(`File type not allowed. Allowed: ${allowedTypes.join(", ")}`)
      setFileState({
        file: null,
        progress: 0,
        status: "error",
        error: `File type not allowed. Allowed: ${allowedTypes.join(", ")}`,
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toastUtil.error(`File size exceeds ${maxSize}MB limit`)
      setFileState({
        file: null,
        progress: 0,
        status: "error",
        error: `File size exceeds ${maxSize}MB limit`,
      })
      return
    }
    
    setFileState({
      file,
      progress: 0,
      status: "idle",
    })
    
    onFileSelect?.(file)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    if (uploadUrl) {
      await handleUpload(file)
    }
  }
  
  const handleUpload = async (file: File) => {
    setFileState((prev) => ({...prev, status: "uploading", progress: 0}))
    
    try {
      const response = await apiClient.upload(uploadUrl!, file, "file", undefined, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.loaded / (progressEvent.total || 1)
          setFileState((prev) => ({...prev, progress: Math.round(progress * 100)}))
        },
      })
      
      if (response.success) {
        toastUtil.success("Upload successful")
        setFileState((prev) => ({
          ...prev,
          status: "success",
          progress: 100,
          response: response.data,
        }))
        
        onUploadComplete?.(response.data)
      } else {
        setFileState((prev) => ({
          ...prev,
          status: "error",
          error: response.message || "Upload failed",
        }))
        
        onUploadError?.(fileState.error)
      }
    } catch (error: any) {
      setFileState((prev) => ({
        ...prev,
        status: "error",
        error: error.message || "Upload failed",
      }))
      
      onUploadError?.(error)
    }
  }
  
  const handleRemove = () => {
    setFileState({
      file: null,
      progress: 0,
      status: "idle",
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    return <FileText className="h-8 w-8"/>
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden"/>
      
      <Button
        type="button"
        variant={buttonVariant}
        onClick={handleButtonClick}
        disabled={fileState.status === "uploading"}
        className="gap-2"
      >
        {fileState.status === "uploading" ? (
          <Loader2 className="h-4 w-4 animate-spin"/>
        ) : (
          <ImportIcon className="h-4 w-4"/>
        )}
        {buttonText}
      </Button>
      
      {showPreview && fileState.file && (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-primary">{getFileIcon(fileState.file.name)}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{fileState.file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatFileSize(fileState.file.size)}</p>
                </div>
                
                <button
                  onClick={handleRemove}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={fileState.status === "uploading"}
                >
                  <X className="h-4 w-4"/>
                </button>
              </div>
              
              {fileState.status === "uploading" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Uploading...</span>
                    <span>{fileState.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                      style={{width: `${fileState.progress}%`}}
                    />
                  </div>
                </div>
              )}
              
              {fileState.status === "success" && (
                <div className="mt-2 flex items-center gap-2 text-xs text-success">
                  <CheckCircle2 className="h-4 w-4"/>
                  <span>Upload successful</span>
                </div>
              )}
              
              {fileState.status === "error" && (
                <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4"/>
                  <span>{fileState.error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
