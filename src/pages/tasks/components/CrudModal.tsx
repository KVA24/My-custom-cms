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
import taskStore, {DataRequest} from "../taskStore.ts";
import {storeSchema} from "@/schemas/itemSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "Create Store"
    case "edit":
      return "Edit Store"
    case "delete":
      return "Delete Store"
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
    
    taskStore.dataRequest = {
      ...taskStore.dataRequest,
      [name]: value,
    };
    
    if (taskStore.errors[name as keyof DataRequest]) {
      taskStore.errors = {
        ...taskStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete") => {
    e.preventDefault()
    
    if (type === "delete") {
      taskStore.delete().then(() => taskStore.isOk && onClose())
      return
    }
    
    try {
      if (type === "create") {
        await storeSchema.validate(taskStore.dataRequest, {abortEarly: false})
        taskStore.errors = {}
        taskStore.create().then(() => taskStore.isOk && onClose())
      } else if (type === "edit") {
        await storeSchema.validate(taskStore.dataRequest, {abortEarly: false})
        taskStore.errors = {}
        taskStore.update().then(() => taskStore.isOk && onClose())
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        taskStore.errors = validationErrors
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
            
            </div>
          )}
          {type === "edit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
            {taskStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal