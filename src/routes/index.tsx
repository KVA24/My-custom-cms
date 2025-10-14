import {Navigate, Route, Routes} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {useAuthStore} from "@/pages/auth/authStore.ts"
import AuthRoutes from "./AuthRoutes"
import AllRoutes from "./AllRoutes.tsx"
import ProtectedRoute from "./ProtectedRoute"
import React from "react";

const AppRoutes = observer(() => {
  const authStore = useAuthStore()
  
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<AuthRoutes.Login/>}/>
      <Route path="/register" element={<AuthRoutes.Register/>}/>
      
      {/* Protected Dashboard Routes */}
      <Route
        path="/cms/*"
        element={!authStore.isInitialized ?
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          :
          <ProtectedRoute>
            <AllRoutes/>
          </ProtectedRoute>
        }
      />
      
      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/cms" replace/>}/>
      <Route path="*" element={<Navigate to="/cms" replace/>}/>
    </Routes>
  )
})

export default AppRoutes
