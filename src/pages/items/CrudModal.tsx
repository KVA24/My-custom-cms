import {observer} from "mobx-react-lite";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import React from "react";
import itemStore, {DataRequest} from "./itemStore.ts";
import {itemSchema} from "@/schemas/itemSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import languageStore from "@/pages/languages/languageStore.ts";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "Create Item"
    case "edit":
      return "Edit Item"
    case "delete":
      return "Delete Item"
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
    
    itemStore.dataRequest = {
      ...itemStore.dataRequest,
      [name]: value,
    };
    
    if (itemStore.errors[name as keyof DataRequest]) {
      itemStore.errors = {
        ...itemStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await itemSchema.validate(itemStore.dataRequest, {abortEarly: false})
      itemStore.errors = {}
      return itemStore.create()
    },
    edit: async () => {
      await itemSchema.validate(itemStore.dataRequest, {abortEarly: false})
      itemStore.errors = {}
      return itemStore.update()
    },
    delete: () => itemStore.delete()
  }
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete") => {
    e.preventDefault()
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (itemStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        itemStore.errors = validationErrors
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
            <div className="flex items-center justify-end w-1/4">
              <Select
                name="state"
                value={languageStore.languageId}
                onValueChange={(value) => {
                  languageStore.languageId = value
                  if (type === 'edit') itemStore.getDetail(itemStore.dataRequest?.id).then()
                }}>
                <SelectTrigger className="w-full" clearable={false}>
                  <SelectValue placeholder="Choose Language"/>
                </SelectTrigger>
                <SelectContent>
                  {(languageStore.listAll || []).map((item, index) => (
                    <SelectItem value={item.id} key={index}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  value={itemStore.dataRequest?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={itemStore.errors.name}
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
                  value={itemStore.dataRequest?.code || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={itemStore.errors.code}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type"
                  value={itemStore.dataRequest?.type || ""}
                  error={itemStore.errors.type}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "type", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {itemStore.listType.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Source Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="sourceType"
                  value={itemStore.dataRequest?.sourceType || ""}
                  error={itemStore.errors.sourceType}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "sourceType", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Source Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {itemStore.listSourceType.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Convert Rate <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="convertRate"
                  name="convertRate"
                  type="number"
                  value={itemStore.dataRequest?.convertRate}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={itemStore.errors.convertRate}
                />
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
                  value={itemStore.dataRequest?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={itemStore.errors.name}
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
                  value={itemStore.dataRequest?.code || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={itemStore.errors.code}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type"
                  value={itemStore.dataRequest?.type || ""}
                  error={itemStore.errors.type}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "type", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {itemStore.listType.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Source Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="sourceType"
                  value={itemStore.dataRequest?.sourceType || ""}
                  error={itemStore.errors.sourceType}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "sourceType", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Source Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {itemStore.listSourceType.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Convert Rate <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="convertRate"
                  name="convertRate"
                  type="text"
                  value={itemStore.dataRequest?.convertRate || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={itemStore.errors.convertRate}
                />
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
            {itemStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal