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
import rewardStore, {DataRequest} from "../rewardStore.ts";
import {rewardSchema} from "@/schemas/rewardSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Switch, SwitchIndicator, SwitchWrapper} from "@/components/ui/switch.tsx";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "Create Reward"
    case "edit":
      return "Edit Reward"
    case "delete":
      return "Delete Reward"
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
  const [selected, setSelected] = React.useState<any[]>([])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    
    rewardStore.dataRequest = {
      ...rewardStore.dataRequest,
      [name]: value,
    };
    
    if (rewardStore.errors[name as keyof DataRequest]) {
      rewardStore.errors = {
        ...rewardStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await rewardSchema.validate(rewardStore.dataRequest, {abortEarly: false})
      rewardStore.errors = {}
      return rewardStore.create()
    },
    edit: async () => {
      await rewardSchema.validate(rewardStore.dataRequest, {abortEarly: false})
      rewardStore.errors = {}
      return rewardStore.update()
    },
    delete: () => rewardStore.delete()
  }
  
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete") => {
    e.preventDefault()
    
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (rewardStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        rewardStore.errors = validationErrors
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
                  Reward Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="rewardName"
                  name="rewardName"
                  type="text"
                  value={rewardStore.dataRequest?.rewardName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.rewardName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  External Id
                </Label>
                <Input
                  autoComplete="off"
                  id="externalId"
                  name="externalId"
                  type="text"
                  value={rewardStore.dataRequest?.externalId || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.externalId}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type"
                  value={rewardStore.dataRequest?.type || ""}
                  error={rewardStore.errors.type}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "type", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {rewardStore.listType.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  ImageId <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="imageId"
                  name="imageId"
                  type="text"
                  value={rewardStore.dataRequest?.imageId || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.imageId}
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
                  type="number"
                  value={rewardStore.dataRequest?.value}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.value}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Value Converted <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="valueConverted"
                  name="valueConverted"
                  type="number"
                  value={rewardStore.dataRequest?.valueConverted}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.valueConverted}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Item <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="itemId"
                  value={rewardStore.dataRequest?.itemId || ""}
                  error={rewardStore.errors.itemId}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "itemId", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Item"/>
                  </SelectTrigger>
                  <SelectContent>
                    {rewardStore.listItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Is Default <span className="text-red-500">*</span>
                </Label>
                <div className="w-full h-full flex items-center">
                  <SwitchWrapper>
                    <Switch size={"sm"} checked={rewardStore.dataRequest.isDefault}
                            onCheckedChange={(checked) => rewardStore.dataRequest.isDefault = checked}/>
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
                  Reward Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="rewardName"
                  name="rewardName"
                  type="text"
                  value={rewardStore.dataRequest?.rewardName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.rewardName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  External Id
                </Label>
                <Input
                  autoComplete="off"
                  id="externalId"
                  name="externalId"
                  type="text"
                  value={rewardStore.dataRequest?.externalId || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.externalId}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type"
                  value={rewardStore.dataRequest?.type || ""}
                  error={rewardStore.errors.type}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "type", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {rewardStore.listType.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  ImageId <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="imageId"
                  name="imageId"
                  type="text"
                  value={rewardStore.dataRequest?.imageId || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.imageId}
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
                  type="number"
                  value={rewardStore.dataRequest?.value}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.value}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Value Converted <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="valueConverted"
                  name="valueConverted"
                  type="number"
                  value={rewardStore.dataRequest?.valueConverted}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={rewardStore.errors.valueConverted}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Item <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="itemId"
                  value={rewardStore.dataRequest?.itemId || ""}
                  error={rewardStore.errors.itemId}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: {name: "itemId", value},
                    } as React.ChangeEvent<HTMLInputElement>)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Item"/>
                  </SelectTrigger>
                  <SelectContent>
                    {rewardStore.listItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Is Default <span className="text-red-500">*</span>
                </Label>
                <div className="w-full h-full flex items-center">
                  <SwitchWrapper>
                    <Switch size={"sm"} checked={rewardStore.dataRequest.isDefault}
                            onCheckedChange={(checked) => rewardStore.dataRequest.isDefault = checked}/>
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
            {rewardStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal