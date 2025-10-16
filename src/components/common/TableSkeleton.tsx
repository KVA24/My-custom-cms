import {cn} from "@/lib/utils"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

const TableSkeleton = ({rows = 5, columns = 4, className}: TableSkeletonProps) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Table Header Skeleton */}
      <div className="flex gap-4 mb-4 pb-3 border-b border-border">
        {Array.from({length: columns}).map((_, i) => (
          <div key={`header-${i}`} className="flex-1">
            <div className="h-4 bg-muted rounded skeleton"/>
          </div>
        ))}
      </div>
      
      {/* Table Rows Skeleton */}
      <div className="space-y-3">
        {Array.from({length: rows}).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4 py-3 border-b border-border/50">
            {Array.from({length: columns}).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1">
                <div className="h-4 bg-muted rounded skeleton shimmer"/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableSkeleton
