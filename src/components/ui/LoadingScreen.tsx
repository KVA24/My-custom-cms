import LoadingSpinner from "@/components/common/LoadingSpinner"

interface LoadingScreenProps {
  message?: string
}

const LoadingScreen = ({message = "Loading..."}: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4"/>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen
