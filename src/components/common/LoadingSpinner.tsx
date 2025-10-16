import {cn} from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "icon"
  className?: string
}

const LoadingSpinner = ({size = "md", className}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    icon: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }
  
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size], className)}
    />
  )
}

export default LoadingSpinner
