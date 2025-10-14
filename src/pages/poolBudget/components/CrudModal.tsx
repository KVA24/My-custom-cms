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
import budgetStore, {DataRequest} from "../budgetStore.ts";
import {budgetAmountSchema, budgetSchema} from "@/schemas/budgetSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete" | "change"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete" | "change") => {
  switch (type) {
    case "create":
      return "Create Budget"
    case "edit":
      return "Edit Budget"
    case "delete":
      return "Delete Budget"
    case "change":
      return "Update Amount"
    default:
      return "Modal"
  }
}

const getSize = (type: "create" | "edit" | "delete" | "change") => {
  switch (type) {
    case "create":
      return "lg"
    case "edit":
      return "lg"
    case "change":
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
    
    budgetStore.dataRequest = {
      ...budgetStore.dataRequest,
      [name]: value,
    };
    
    if (budgetStore.errors[name as keyof DataRequest]) {
      budgetStore.errors = {
        ...budgetStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await budgetSchema.validate(budgetStore.dataRequest, {abortEarly: false})
      budgetStore.errors = {}
      return budgetStore.create()
    },
    edit: async () => {
      await budgetSchema.validate(budgetStore.dataRequest, {abortEarly: false})
      budgetStore.errors = {}
      return budgetStore.update()
    },
    change: async () => {
      await budgetAmountSchema.validate(budgetStore.dataRequestChange, {abortEarly: false})
      budgetStore.errors = {}
      return budgetStore.updateAmount()
    },
    delete: () => budgetStore.delete()
  }
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete" | "change") => {
    e.preventDefault()
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (budgetStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        budgetStore.errors = validationErrors
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
                  value={budgetStore.dataRequest?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={budgetStore.errors.name}
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
                  value={budgetStore.dataRequest?.value}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={budgetStore.errors.value}
                />
              </div>
            </div>
          )}
          {type === "edit" && (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="name"
                  name="name"
                  type="text"
                  value={budgetStore.dataRequest?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={budgetStore.errors.name}
                />
              </div>
            </div>
          )}
          {type === "change" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="amount"
                  name="amount"
                  type="text"
                  value={budgetStore.dataRequestChange?.amount || ""}
                  onChange={(e) => {
                    budgetStore.dataRequestChange.amount = parseInt(e.currentTarget.value)
                  }}
                  placeholder="Enter"
                  error={budgetStore.errors.amount}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Action <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type"
                  value={budgetStore.dataRequestChange?.action || ""}
                  error={budgetStore.errors.action}
                  onValueChange={(value) =>
                    budgetStore.dataRequestChange.action = value
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Action"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"ADD"}>Add</SelectItem>
                    <SelectItem value={"SUBTR"}>Subtract</SelectItem>
                  </SelectContent>
                </Select>
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
            {budgetStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal