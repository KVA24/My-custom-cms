import {Navigate} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {useAuthStore} from "@/pages/auth/authStore.ts"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"

const AuthRoutes = {
  Login: observer(() => {
    const authStore = useAuthStore()
    return authStore.isAuthenticated ? <Navigate to="/cms" replace/> : <LoginPage/>
  }),
  
  Register: observer(() => {
    const authStore = useAuthStore()
    return authStore.isAuthenticated ? <Navigate to="/cms" replace/> : <RegisterPage/>
  }),
}

export default AuthRoutes
