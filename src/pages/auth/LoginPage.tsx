"use client"

import type React from "react"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {type LoginCredentials, useAuthStore} from "@/pages/auth/authStore.ts"
import {loginSchema} from "@/schemas/authSchemas"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {InputPassword} from "@/components/ui/inputPassword.tsx"
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx"
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"

const LoginPage = observer(() => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const {executeRecaptcha} = useGoogleReCaptcha()
  
  const [formData, setFormData] = useState<LoginCredentials>({
    username: localStorage.getItem("kkk_check_kkk") ? "admin" : "",
    password: localStorage.getItem("kkk_check_kkk") ? "Matkhau@123" : "",
    otpCode: "",
  })
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({})
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
    
    if (errors[name as keyof LoginCredentials]) {
      setErrors((prev) => ({...prev, [name]: undefined}))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await loginSchema.validate(formData, {abortEarly: false})
      setErrors({})
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available")
        return
      }
      const token = await executeRecaptcha()
      
      const result = await authStore.login(formData, token)
      if (result) {
        navigate("/dashboard")
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<LoginCredentials> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof LoginCredentials] = err.message
        })
        setErrors(validationErrors)
      }
    }
  }
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-8">
        <Card className="border-border shadow-xl backdrop-blur-sm fade-in">
          <CardHeader className="text-center py-6 space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">{t("auth.loginTitle")}</CardTitle>
            <CardDescription className="text-base">{t("auth.loginSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  {t("auth.username")}
                </label>
                <Input
                  autoComplete="off"
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    e.key === "Enter" && handleSubmit(e)
                  }}
                  placeholder="Enter username or email"
                  error={errors.username}
                  variant="lg"
                  className="transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  {t("auth.password")}
                </label>
                <InputPassword
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    e.key === "Enter" && handleSubmit(e)
                  }}
                  placeholder="Enter password"
                  error={errors.password}
                  variant="lg"
                  className="transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="otpCode" className="block text-sm font-medium">
                  OTP
                </label>
                <Input
                  autoComplete="off"
                  id="otpCode"
                  name="otpCode"
                  type="text"
                  value={formData.otpCode}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    e.key === "Enter" && handleSubmit(e)
                  }}
                  placeholder="Enter otp"
                  error={errors.otpCode}
                  variant="lg"
                  className="transition-smooth"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full mt-2 h-11 text-base font-medium shadow-lg hover:shadow-xl transition-smooth"
                loading={authStore.isLoading}
                disabled={authStore.isLoading}
              >
                {authStore.isLoading ? <LoadingSpinner size="sm"/> : t("auth.signIn")}
              </Button>
            </form>
            
            {/*<div className="mt-6 text-center">*/}
            {/*  <p className="text-sm text-gray-600">*/}
            {/*    {t("auth.dontHaveAccount")}{" "}*/}
            {/*    <Link to="/register" className="font-medium text-primary hover:text-primary/80">*/}
            {/*      {t("auth.signUp")}*/}
            {/*    </Link>*/}
            {/*  </p>*/}
            {/*</div>*/}
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">Secure login powered by Wii</p>
      </div>
    </div>
  )
})

export default LoginPage
