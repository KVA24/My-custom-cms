"use client"

import type React from "react"
import {observer} from "mobx-react-lite"
import {Lock, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils.ts"
import {Label} from "@/components/ui/label.tsx";
import {InputPassword} from "@/components/ui/inputPassword.tsx";
import authStore, {ChangePasswordCredentials} from "@/pages/auth/authStore.ts";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {changePassSchema} from "@/schemas/authSchemas.ts";
import {Input} from "@/components/ui/input.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

interface PasswordChangeProps {
  isOpen: boolean
  onClose: () => void
}

const PasswordChange = observer(({isOpen, onClose}: PasswordChangeProps) => {
  const {executeRecaptcha} = useGoogleReCaptcha();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    
    const newValue =
      name === "username" || name === "password"
        ? value.trim()
        : value;
    
    authStore.dataChangePassword = {
      ...authStore.dataChangePassword,
      [name]: newValue,
    };
    
    if (authStore.errors[name as keyof ChangePasswordCredentials]) {
      authStore.errors = {
        ...authStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await changePassSchema.validate(authStore.dataChangePassword, {abortEarly: false})
      authStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      return authStore.changePassword(sign).then(() => handleClose())
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<ChangePasswordCredentials> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof ChangePasswordCredentials] = err.message
        })
        authStore.errors = validationErrors
      }
    }
  }
  
  const handleClose = () => {
    authStore.clearState()
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Backdrop */}
        <div className="fixed inset-0 bg-zinc-200 opacity-50 z-40 transition-opacity" onClick={handleClose}/>
      
      {/* Drawer */}
        <div
          className={cn(
            "fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-blue-600"/>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change Password</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5"/>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <InputPassword
                  autoComplete="off"
                  id="oldPassword"
                  name="oldPassword"
                  type="text"
                  value={authStore.dataChangePassword?.oldPassword || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={authStore.errors.password}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <InputPassword
                  autoComplete="off"
                  id="newPassword"
                  name="newPassword"
                  type="text"
                  value={authStore.dataChangePassword?.newPassword || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={authStore.errors.newPassword}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <InputPassword
                  autoComplete="off"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="text"
                  value={authStore.dataChangePassword?.confirmNewPassword || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={authStore.errors.confirmNewPassword}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  OTP <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="otpCode"
                  name="otpCode"
                  type="text"
                  value={authStore.dataChangePassword?.otpCode || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={authStore.errors.otpCode}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={authStore.isLoadingBt || !authStore.dataChangePassword?.oldPassword || !authStore.dataChangePassword?.newPassword || !authStore.dataChangePassword?.confirmNewPassword}
                loading={authStore.isLoadingBt}
                className="w-full"
                onClick={handleSubmit}
              >
                {authStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : "Change Password"}
              </Button>
            </div>
          </div>
        </div>
    </>
  )
})

export default PasswordChange
