import type React from "react"
import type {LucideIcon} from "lucide-react"
import {cn} from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const EmptyState = ({icon: Icon, title, description, action, className}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center fade-in", className)}>
      {Icon && (
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 transition-smooth hover:scale-105">
          <Icon className="h-8 w-8 text-muted-foreground"/>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
