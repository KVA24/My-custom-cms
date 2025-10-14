"use client"

import React from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import {AlertTriangle, RefreshCw} from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = {hasError: false}
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {hasError: true, error}
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error}/>
    }
    
    return this.props.children
  }
}

const ErrorFallback = ({error}: { error?: Error }) => {
  const {t} = useTranslation()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400"/>
          </div>
          <CardTitle>{t("error.somethingWentWrong")}</CardTitle>
          <CardDescription>{t("error.unexpectedError")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center flex flex-col gap-4">
          {process.env.NODE_ENV === "development" && error && (
            <div
              className="text-left bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono text-red-600 dark:text-red-400">
              {error.message}
            </div>
          )}
          <Button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4"/>
            <span>{t("error.refreshPage")}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorBoundary
