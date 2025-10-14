"use client"

import {useState} from "react"
import {ChevronLeft, ChevronRight, X, ZoomIn} from "lucide-react"
import {cn} from "@/lib/utils"

export interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
}

export interface ImageGalleryProps {
  images: GalleryImage[]
  columns?: number
  className?: string
}

export function ImageGallery({images, columns = 3, className}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  
  const openModal = (index: number) => {
    setSelectedImage(index)
  }
  
  const closeModal = () => {
    setSelectedImage(null)
  }
  
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }
  
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }
  
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }
  
  return (
    <>
      <div className={cn("grid gap-4", gridCols[columns as keyof typeof gridCols], className)}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => openModal(index)}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
            </div>
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
                <h3 className="text-white font-medium">{image.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button onClick={closeModal} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="h-8 w-8"/>
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-8 w-8"/>
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-8 w-8"/>
            </button>
            
            <img
              src={images[selectedImage].src || "/placeholder.svg"}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            {images[selectedImage].title && (
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-semibold">{images[selectedImage].title}</h3>
                {images[selectedImage].description && (
                  <p className="text-gray-300 mt-1">{images[selectedImage].description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
