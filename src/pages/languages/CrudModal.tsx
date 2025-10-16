import {observer} from "mobx-react-lite";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import React from "react";
import languageStore, {DataRequest} from "./languageStore.ts";
import {languageSchema} from "@/schemas/languageSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Switch, SwitchIndicator, SwitchWrapper} from "@/components/ui/switch.tsx";
import ImageUpload from "@/components/common/ImageUpload.tsx";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "Create Language"
    case "edit":
      return "Edit Language"
    case "delete":
      return "Delete Language"
    default:
      return "Modal"
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
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    
    languageStore.dataRequest = {
      ...languageStore.dataRequest,
      [name]: value,
    };
    
    if (languageStore.errors[name as keyof DataRequest]) {
      languageStore.errors = {
        ...languageStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await languageSchema.validate(languageStore.dataRequest, {abortEarly: false})
      languageStore.errors = {}
      return languageStore.create()
    },
    edit: async () => {
      await languageSchema.validate(languageStore.dataRequest, {abortEarly: false})
      languageStore.errors = {}
      return languageStore.update()
    },
    delete: () => languageStore.delete()
  }
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete") => {
    e.preventDefault()
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (languageStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        languageStore.errors = validationErrors
        console.log(validationErrors)
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
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="name"
                  name="name"
                  type="text"
                  value={languageStore.dataRequest?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={languageStore.errors.name}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="code"
                  name="code"
                  type="text"
                  value={languageStore.dataRequest?.code || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={languageStore.errors.code}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Sort <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="position"
                  name="position"
                  type="number"
                  value={languageStore.dataRequest.position}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={languageStore.errors.position}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Icon <span className="text-red-500">*</span>
                </Label>
                <ImageUpload
                  multiple={false}
                  maxSize={1}
                  maxFiles={1}
                  value={languageStore.dataRequest?.iconUrl}
                  onChange={(value) => {
                    languageStore.dataRequest.iconUrl = value
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={languageStore.dataRequest?.state || ""}
                  error={languageStore.errors.state}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "state", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"ACTIVE"}>Active</SelectItem>
                    <SelectItem value={"INACTIVE"}>InActive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Is Default <span className="text-red-500">*</span>
                </Label>
                <div className="w-full h-full flex items-center">
                  <SwitchWrapper>
                    <Switch size={"sm"} checked={languageStore.dataRequest.isDefault}
                            onCheckedChange={(checked) => languageStore.dataRequest.isDefault = checked}/>
                    <SwitchIndicator state="on"></SwitchIndicator>
                    <SwitchIndicator state="off"></SwitchIndicator>
                  </SwitchWrapper>
                </div>
              </div>
            </div>
          )}
          {type === "edit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="name"
                  name="name"
                  type="text"
                  value={languageStore.dataRequest?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={languageStore.errors.name}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="code"
                  name="code"
                  type="text"
                  value={languageStore.dataRequest?.code || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={languageStore.errors.code}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Sort <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="position"
                  name="position"
                  type="number"
                  value={languageStore.dataRequest.position}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={languageStore.errors.position}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Icon <span className="text-red-500">*</span>
                </Label>
                <ImageUpload
                  multiple={false}
                  maxSize={1}
                  maxFiles={1}
                  value={languageStore.dataRequest?.iconUrl}
                  onChange={(value) => {
                    console.log(value)
                    languageStore.dataRequest.iconUrl = value
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={languageStore.dataRequest?.state || ""}
                  error={languageStore.errors.state}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "state", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"ACTIVE"}>Active</SelectItem>
                    <SelectItem value={"INACTIVE"}>InActive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Is Default <span className="text-red-500">*</span>
                </Label>
                <div className="w-full h-full flex items-center">
                  <SwitchWrapper>
                    <Switch size={"sm"} checked={languageStore.dataRequest.isDefault}
                            onCheckedChange={(checked) => languageStore.dataRequest.isDefault = checked}/>
                    <SwitchIndicator state="on"></SwitchIndicator>
                    <SwitchIndicator state="off"></SwitchIndicator>
                  </SwitchWrapper>
                </div>
              </div>
            </div>
          )}
          {type === "delete" && (
            <div className="flex flex-col gap-4">
              <p>Are you sure want to delete this?</p>
            </div>
          )}
        
        </div>
        
        <DialogFooter className="flex gap-1">
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button variant="primary" onClick={(e) => handleSubmit(e, type)}>
            {languageStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal