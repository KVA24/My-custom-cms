import CardSkeleton from "@/components/common/CardSkeletion"

const PageSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded skeleton shimmer"/>
          <div className="h-4 w-32 bg-muted rounded skeleton shimmer"/>
        </div>
        <div className="h-10 w-32 bg-muted rounded skeleton shimmer"/>
      </div>
      
      {/* Content Skeleton */}
      <CardSkeleton/>
    </div>
  )
}

export default PageSkeleton
