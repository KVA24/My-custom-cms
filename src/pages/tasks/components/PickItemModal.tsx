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
import taskStore, {QuestDto} from "../taskStore.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {CheckIcon} from "lucide-react";

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const PickItemModal = observer(({isOpen, onClose}: ModalProps) => {
  const {t} = useTranslation()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    taskStore.dataRequest.questDtos = [...taskStore.listQuestSelected]
    onClose()
  }
  
  function hasId(items: any[], id: string): boolean {
    return items.some((item) => item.eventId === id);
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-lg max-h-[90vh] overflow-y-auto`}
                     onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Choose Reward</DialogTitle>
          <DialogDescription className="text-muted-foreground">
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
          {(taskStore.listQuests || []).map((item: QuestDto) => (
            <button key={item.id} onClick={() => {
              if (hasId(taskStore.listQuestSelected || [], item.id)) {
                taskStore.listQuestSelected = taskStore.listQuestSelected.filter((i) => i.id !== item.id)
              } else {
                taskStore.listQuestSelected.push({
                  ...item,
                  id: item.id,
                  eventId: item.id,
                  periodUnit: '',
                  periodValue: 0,
                  minCount: 0,
                  maxCount: 0,
                  continuous: false,
                  aggregateType: ''
                })
              }
            }}
                    className="w-full flex items-center justify-between bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <span className="text-sm font-medium">
                 {item.name}
              </span>
              {hasId(taskStore.listQuestSelected || [], item.id) && (
                <CheckIcon size={16}/>
              )}
            </button>
          ))}
        </div>
        <DialogFooter className="flex gap-1">
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            {taskStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </DialogFooter>
      
      </DialogContent>
    </Dialog>
  )
})

export default PickItemModal