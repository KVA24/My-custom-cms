import {cn} from "@/lib/utils"
import {Card, CardContent, CardHeader} from "@/components/ui/card"

interface CardSkeletonProps {
  className?: string
  hasHeader?: boolean
}

const CardSkeleton = ({className, hasHeader = true}: CardSkeletonProps) => {
  return (
    <Card className={cn("", className)}>
      {hasHeader && (
        <CardHeader>
          <div className="space-y-2">
            <div className="h-6 w-1/3 bg-muted rounded skeleton shimmer"/>
            <div className="h-4 w-1/2 bg-muted rounded skeleton shimmer"/>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded skeleton shimmer"/>
          <div className="h-4 bg-muted rounded skeleton shimmer w-5/6"/>
          <div className="h-4 bg-muted rounded skeleton shimmer w-4/6"/>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardSkeleton
