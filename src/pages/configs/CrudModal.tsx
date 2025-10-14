import {observer} from "mobx-react-lite";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import React from "react";
import configStore, {DataRequest} from "./configStore.ts";
import {configDeleteSchema, configSchema} from "@/schemas/configSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "Create Config"
    case "edit":
      return "Edit Config"
    case "delete":
      return "Delete Config"
  }
}

const getSize = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "lg"
    case "edit":
      return "lg"
    case "delete":
      return "sm"
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
    
    configStore.dataRequest = {
      ...configStore.dataRequest,
      [name]: value,
    };
    
    if (configStore.errors[name as keyof DataRequest]) {
      configStore.errors = {
        ...configStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await configSchema.validate(configStore.dataRequest, {abortEarly: false})
      configStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      return configStore.create(sign)
    },
    edit: async () => {
      await configSchema.validate(configStore.dataRequest, {abortEarly: false})
      configStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      return configStore.update(sign)
    },
    delete: async () => {
      await configDeleteSchema.validate({otpCode: configStore.otpCode}, {abortEarly: false})
      configStore.errors = {}
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available')
        return
      }
      const sign = await executeRecaptcha()
      configStore.delete(sign).then(() => onClose())
    }
  }
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete") => {
    e.preventDefault()
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (configStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        configStore.errors = validationErrors
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
                  Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="key"
                  name="key"
                  type="text"
                  value={configStore.dataRequest?.keyConfig}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={configStore.errors.key}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="value"
                  name="value"
                  type="text"
                  value={configStore.dataRequest?.valueConfig}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={configStore.errors.value}
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
                  value={configStore.dataRequest?.otpCode}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={configStore.errors.otpCode}
                />
              </div>
            </div>
          )}
          {type === "edit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="key"
                  name="key"
                  type="text"
                  value={configStore.dataRequest?.keyConfig}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={configStore.errors.key}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="value"
                  name="value"
                  type="text"
                  value={configStore.dataRequest?.valueConfig}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={configStore.errors.value}
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
                  value={configStore.dataRequest?.otpCode}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={configStore.errors.otpCode}
                />
              </div>
            </div>
          )}
          {type === "delete" && (
            <div className="flex flex-col gap-4">
              <p>Are you sure want to delete this ?</p>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  OTP <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="otpCode"
                  name="otpCode"
                  type="text"
                  value={configStore.otpCode}
                  onChange={(e) => configStore.otpCode = e.target.value}
                  placeholder="Enter"
                  error={configStore.errors.otpCode}
                />
              </div>
            </div>
          )}
        
        </div>
        
        <DialogFooter className="flex gap-1">
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button variant="primary" onClick={(e) => handleSubmit(e, type)}>
            {configStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal