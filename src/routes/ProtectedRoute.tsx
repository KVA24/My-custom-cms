import type React from "react"
import {Navigate, useLocation} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {useAuthStore} from "@/pages/auth/authStore.ts"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = observer(({children}: ProtectedRouteProps) => {
  const authStore = useAuthStore()
  const location = useLocation()
  
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" state={{from: location}} replace/>
  }
  
  return <>{children}</>
})

export default ProtectedRoute
