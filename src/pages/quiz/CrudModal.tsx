import {observer} from "mobx-react-lite";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import React from "react";
import quizStore, {DataRequest} from "./quizStore.ts";
import {quizSchema} from "@/schemas/quizSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Trash2} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";
import languageStore from "@/pages/languages/languageStore.ts";

interface ModalProps {
  isOpen: boolean
  type: "create" | "edit" | "delete"
  onClose: () => void
}

const getTitle = (type: "create" | "edit" | "delete") => {
  switch (type) {
    case "create":
      return "Create Quiz"
    case "edit":
      return "Edit Quiz"
    case "delete":
      return "Delete Quiz"
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
    
    quizStore.dataRequest = {
      ...quizStore.dataRequest,
      [name]: value,
    };
    
    if (quizStore.errors[name as keyof DataRequest]) {
      quizStore.errors = {
        ...quizStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const actions = {
    create: async () => {
      await quizSchema.validate(quizStore.dataRequest, {abortEarly: false})
      quizStore.errors = {}
      return quizStore.create()
    },
    edit: async () => {
      await quizSchema.validate(quizStore.dataRequest, {abortEarly: false})
      quizStore.errors = {}
      return quizStore.update()
    },
    delete: () => quizStore.delete()
  }
  
  const handleSubmit = async (e: React.FormEvent, type: "create" | "edit" | "delete") => {
    e.preventDefault()
    try {
      const fn = actions[type]
      if (fn) {
        await fn()
        if (quizStore.isOk) onClose()
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        quizStore.errors = validationErrors
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
                  if (type === 'edit') quizStore.getDetail(quizStore.dataRequest?.id).then()
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
                  id="question"
                  name="question"
                  type="text"
                  value={quizStore.dataRequest?.question || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={quizStore.errors.question}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={quizStore.dataRequest?.state || ""}
                  error={quizStore.errors.state}
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
              <div className="flex flex-col gap-2 col-span-2">
                <Label variant="secondary">
                  Explain <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  autoComplete="off"
                  id="explanation"
                  name="explanation"
                  value={quizStore.dataRequest?.explanation || ""}
                  onChange={(e) => quizStore.dataRequest.explanation = e.currentTarget.value}
                  placeholder="Enter"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label variant="secondary">
                  Options <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center justify-start">
                  <Button variant="primary" onClick={() => {
                    quizStore.dataRequest.options?.push("")
                  }}>
                    Add option
                  </Button>
                </div>
                {quizStore.errors.options &&
                  <p className="text-sm text-destructive mt-1">{quizStore.errors.options}</p>}
                <div className="flex flex-col gap-2 w-full">
                  {quizStore.dataRequest.options?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <Input
                        autoComplete="off"
                        id="explanation"
                        name="explanation"
                        type="text"
                        value={item}
                        onChange={(e) => item = e.currentTarget.value}
                        placeholder="Enter"
                        error={quizStore.errors[`options[${index}].periodType`]}
                      />
                      <Button data-tooltip-id="app-tooltip"
                              data-tooltip-content={"Delete reward"}
                              variant={"danger"}
                              size={"sm"} onClick={() => {
                        quizStore.dataRequest.options.splice(index, 1)
                      }}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label variant="secondary">
                  Correct Answer Index <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="correctAnswerIndex"
                  name="correctAnswerIndex"
                  type="number"
                  value={quizStore.dataRequest?.correctAnswerIndex || 0}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={quizStore.errors.correctAnswerIndex}
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
                  id="question"
                  name="question"
                  type="text"
                  value={quizStore.dataRequest?.question || ""}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={quizStore.errors.question}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={quizStore.dataRequest?.state || ""}
                  error={quizStore.errors.state}
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
              <div className="flex flex-col gap-2 col-span-2">
                <Label variant="secondary">
                  Explain <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  autoComplete="off"
                  id="explanation"
                  name="explanation"
                  value={quizStore.dataRequest?.explanation || ""}
                  onChange={(e) => quizStore.dataRequest.explanation = e.currentTarget.value}
                  placeholder="Enter"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label variant="secondary">
                  Options <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center justify-start">
                  <Button variant="primary" onClick={() => {
                    quizStore.dataRequest.options?.push("")
                  }}>
                    Add option
                  </Button>
                </div>
                {quizStore.errors.options &&
                  <p className="text-sm text-destructive mt-1">{quizStore.errors.options}</p>}
                <div className="flex flex-col gap-2 w-full">
                  {quizStore.dataRequest.options?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <Input
                        autoComplete="off"
                        id="explanation"
                        name="explanation"
                        type="text"
                        value={item}
                        onChange={(e) => item = e.currentTarget.value}
                        placeholder="Enter"
                        error={quizStore.errors[`options[${index}].periodType`]}
                      />
                      <Button data-tooltip-id="app-tooltip"
                              data-tooltip-content={"Delete reward"}
                              variant={"danger"}
                              size={"sm"} onClick={() => {
                        quizStore.dataRequest.options.splice(index, 1)
                      }}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label variant="secondary">
                  Correct Answer Index <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoComplete="off"
                  id="correctAnswerIndex"
                  name="correctAnswerIndex"
                  type="number"
                  value={quizStore.dataRequest?.correctAnswerIndex || 0}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={quizStore.errors.correctAnswerIndex}
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
            {quizStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default CrudModal