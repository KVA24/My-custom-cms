"use client"

import type React from "react"
import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {type RegisterCredentials, useAuthStore} from "@/pages/auth/authStore.ts"
import {registerSchema} from "@/schemas/authSchemas"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const RegisterPage = observer(() => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const authStore = useAuthStore()
  
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<RegisterCredentials>>({})
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
    
    // Clear error when user starts typing
    if (errors[name as keyof RegisterCredentials]) {
      setErrors((prev) => ({...prev, [name]: undefined}))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await registerSchema.validate(formData, {abortEarly: false})
      setErrors({})
      
      const result = await authStore.register(formData)
      if (result) {
        navigate("/dashboard")
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<RegisterCredentials> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof RegisterCredentials] = err.message
        })
        setErrors(validationErrors)
      }
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col gap-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t("auth.registerTitle")}</CardTitle>
            <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("auth.name")}
                </label>
                <Input
                  autoComplete="off"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("auth.email")}
                </label>
                <Input
                  autoComplete="off"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("auth.password")}
                </label>
                <Input
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("auth.confirmPassword")}
                </label>
                <Input
                  autoComplete="off"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              
              <Button type="submit" className="w-full">
                {t("auth.signUp")}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                  {t("auth.signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

export default RegisterPage
