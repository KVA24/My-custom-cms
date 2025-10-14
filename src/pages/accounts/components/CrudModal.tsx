import {observer} from "mobx-react-lite";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx"
import React from "react";
import accountStore, {DataRequest} from "../accountStore.ts";
import {accountCreateSchema, accountEditSchema, deleteSchema} from "@/schemas/accountSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select.tsx';
import {InputPassword} from "@/components/ui/inputPassword.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete" | "showQr" | "changePass"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete" | "showQr" | "changePass") => {
  switch (type) {
    case "create":
      return "Create Account"
    case "edit":
      return "Edit Account"
    case "delete":
      return "Delete Account"
    case "showQr":
      return "Account QR Code"
    default:
      return "Modal"
  }
}

const getSize = (type: "create" | "edit" | "delete" | "showQr" | "changePass") => {
  switch (type) {
    case "create":
      return "lg"
    case "edit":
      return "lg"
    case "delete":
      return "sm"
    default:
      return "md"
  }
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
}

const CrudModal = observer(({isOpen, type, onClose}: ModalProps) => {
  const {t} = useTranslation()
  const {executeRecaptcha} = useGoogleReCaptcha();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    
    const newValue =
      name === "username" || name === "password"
        ? value.trim()
        : value;
    
    accountStore.dataRequest = {
      ...accountStore.dataRequest,
      [name]: newValue,
    };
    
    if (accountStore.errors[name as keyof DataRequest]) {
      accountStore.errors = {
        ...accountStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await accountCreateSchema.validate(accountStore.dataRequest, {abortEarly: false})
      accountStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      return accountStore.create(sign).then(() => accountStore.isOk && onClose())
    },
    edit: async () => {
      await accountEditSchema.validate(accountStore.dataRequest, {abortEarly: false})
      accountStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      return accountStore.update(sign).then(() => accountStore.isOk && onClose())
    },
    delete: async () => {
      await deleteSchema.validate({otpCode: accountStore.otpCode}, {abortEarly: false})
      accountStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      accountStore.delete(sign).then(() => accountStore.isOk && onClose())
    },
  }
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete" | "showQr" | "changePass") => {
    e.preventDefault()
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (accountStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        accountStore.errors = validationErrors
      }
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[getSize(type)]} max-h-[90vh] overflow-y-auto`}
                     onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{getTitle(type)}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
          
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {type === "create" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="username"
                  name="username"
                  type="text"
                  value={accountStore.dataRequest?.username || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.username}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Password <span className="text-red-500">*</span>
                </Label>
                <InputPassword
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="text"
                  value={accountStore.dataRequest?.password || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.password}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="role"
                  value={accountStore.dataRequest?.role || ""}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "role", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Role"/>
                  </SelectTrigger>
                  <SelectContent>
                    {accountStore.listRole?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={accountStore.dataRequest?.state || ""}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "state", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">InActive</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={accountStore.dataRequest?.otpCode || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.otpCode}
                />
              </div>
            </div>
          )}
          {type === "edit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="username"
                  name="username"
                  type="text"
                  value={accountStore.dataRequest?.username || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.username}
                />
              </div>
              <div className="flex flex-col gap-2">
              
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="role"
                  value={accountStore.dataRequest?.role || ""}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "role", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Role"/>
                  </SelectTrigger>
                  <SelectContent>
                    {accountStore.listRole?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={accountStore.dataRequest?.state || ""}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "state", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">InActive</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={accountStore.dataRequest?.otpCode || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.otpCode}
                />
              </div>
            </div>
          )}
          {type === "delete" && (
            <div className="flex flex-col gap-4">
              <p>Are you sure want to delete this?</p>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  OTP <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="otpCode"
                  name="otpCode"
                  type="text"
                  value={accountStore.otpCode}
                  onChange={(e) => accountStore.otpCode = e.target.value}
                  placeholder="Enter"
                  error={accountStore.errors.otpCode}
                />
              </div>
            </div>
          )}
          {type === "changePass" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Old Password <span className="text-red-500">*</span>
                </Label>
                <InputPassword
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="text"
                  value={accountStore.dataRequest?.password || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.password}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <InputPassword
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="text"
                  value={accountStore.dataRequest?.password || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={accountStore.errors.password}
                />
              </div>
            </div>
          )}
          {type === "showQr" && (
            <div className="flex flex-col gap-4">
              <img src={accountStore.qrCode} alt="qrCode" className="w-full"/>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-1">
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
          {type !== "showQr" && (
            <Button variant="primary" onClick={(e) => handleSubmit(e, type)}>
              {accountStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
            </Button>
          )}
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal