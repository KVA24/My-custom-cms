import React, {useEffect} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx"
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import taskStore, {DataRequest} from "../taskStore.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {taskSchema} from "@/schemas/taskSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {observer} from "mobx-react-lite";
import {ChevronLeft, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import PickItemModal from "./PickItemModal.tsx";
import {Switch, SwitchIndicator, SwitchWrapper} from "@/components/ui/switch.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import DateRangePicker from "@/components/ui/dateRangePicker.tsx";
import DatePickerInput from "@/components/ui/datePicker.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const CreateTask = observer(() => {
  const {t} = useTranslation()
  const [open, setOpen] = React.useState(false)
  
  useEffect(() => {
    taskStore.callAllGet().then()
    taskStore.getAllEvent().then()
  }, []);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await taskSchema.validate(taskStore.dataRequest, {abortEarly: false})
      taskStore.errors = {}
      taskStore.create().then()
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
  
  const handleBack = () => {
    window.history.back()
  }
  
  return (
    <div className="flex flex-col gap-6">
      <CustomBreadcrumb
        items={[
          {label: 'Home', href: '/'},
          {label: 'Tasks', href: '/cms/tasks'},
          {label: 'Create Task', isCurrent: true},
        ]}
      />
      <Card className="border-border shadow-sm">
        <CardHeader className="flex items-center justify-start gap-2">
          <Button
            variant="secondary"
            size="sm"
            data-tooltip-id="app-tooltip"
            data-tooltip-content={t("common.back")}
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4 text-foreground"/>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Task</h1>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="name"
                name="name"
                type="text"
                value={taskStore.dataRequest?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.name}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Position <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="position"
                name="position"
                type="number"
                value={taskStore.dataRequest?.position || 0}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.position}
              />
            </div>
            <div className="flex flex-col col-span-2 gap-2">
              <Label variant="secondary">
                Description
              </Label>
              <Textarea
                autoComplete="off"
                id="description"
                name="description"
                value={taskStore.dataRequest?.description || ""}
                onChange={(e) => {
                  taskStore.dataRequest.description = e.target.value
                }}
                placeholder="Enter"
                error={taskStore.errors.description}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  Is Recurring ? <span className="text-red-500">*</span>
                </Label>
                <div className="w-full h-full flex items-center">
                  <SwitchWrapper>
                    <Switch size={"sm"} checked={taskStore.dataRequest.isRecurring}
                            onCheckedChange={(checked) => taskStore.dataRequest.isRecurring = checked}/>
                    <SwitchIndicator state="on"></SwitchIndicator>
                    <SwitchIndicator state="off"></SwitchIndicator>
                  </SwitchWrapper>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label variant="secondary">
                  No End Date ? <span className="text-red-500">*</span>
                </Label>
                <div className="w-full h-full flex items-center">
                  <SwitchWrapper>
                    <Switch size={"sm"} checked={taskStore.dataRequest.isNoEndDate}
                            onCheckedChange={(checked) => taskStore.dataRequest.isNoEndDate = checked}/>
                    <SwitchIndicator state="on"></SwitchIndicator>
                    <SwitchIndicator state="off"></SwitchIndicator>
                  </SwitchWrapper>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                {taskStore.dataRequest.isNoEndDate ? "Start Date" : "Start-End Date"} <span
                className="text-red-500">*</span>
              </Label>
              {taskStore.dataRequest.isNoEndDate ? (
                <DatePickerInput
                  value={taskStore.dataRequest.startDate}
                  onChange={(date) => {
                    taskStore.dataRequest.startDate = date || null
                  }}
                />
              ) : (
                <DateRangePicker
                  start={taskStore.dataRequest.startDate}
                  end={taskStore.dataRequest.endDate}
                  onApply={(range) => {
                    console.log(range)
                    taskStore.dataRequest.startDate = range?.from ?? new Date()
                    taskStore.dataRequest.endDate = range?.to ?? new Date()
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Period Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                name="periodUnit"
                value={taskStore.dataRequest?.periodUnit || ""}
                error={taskStore.errors.periodUnit}
                onValueChange={(value) => {
                  handleInputChange({
                    target: {name: "periodUnit", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                  taskStore.getSlidingType().then()
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Unit"/>
                </SelectTrigger>
                <SelectContent>
                  {(taskStore.objectList['periodUnit'] || []).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Period Value <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="periodValue"
                name="periodValue"
                type="number"
                value={taskStore.dataRequest?.periodValue || 0}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.periodValue}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Task Category
              </Label>
              <Select
                name="taskCategory"
                value={taskStore.dataRequest?.taskCategory || ""}
                error={taskStore.errors.taskCategory}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "taskCategory", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Category"/>
                </SelectTrigger>
                <SelectContent>
                  {(taskStore.objectList['taskCategory'] || []).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Sliding Type
              </Label>
              <Select
                name="slidingType"
                value={taskStore.dataRequest?.slidingType || ""}
                error={taskStore.errors.slidingType}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "slidingType", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Type"/>
                </SelectTrigger>
                <SelectContent>
                  {(taskStore.listSlidingType || []).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Deep Link
              </Label>
              <Input
                autoComplete="off"
                id="deepLink"
                name="deepLink"
                type="text"
                value={taskStore.dataRequest?.deepLink || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.deepLink}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                ImageId
              </Label>
              <Input
                autoComplete="off"
                id="imageId"
                name="imageId"
                type="text"
                value={taskStore.dataRequest?.imageId || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.imageId}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Reward Amount
              </Label>
              <Input
                autoComplete="off"
                id="rewardAmount"
                name="rewardAmount"
                type="number"
                value={taskStore.dataRequest?.rewardAmount || 0}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.rewardAmount}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                OTP
              </Label>
              <Input
                autoComplete="off"
                id="otpCode"
                name="otpCode"
                type="text"
                value={taskStore.dataRequest?.otpCode || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.otpCode}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label variant="secondary">
              Quest <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center justify-start">
              <Button variant="primary" onClick={() => {
                taskStore.listQuestSelected = [...taskStore.dataRequest.questDtos]
                setOpen(true)
              }}>
                Add quest
              </Button>
            </div>
            {taskStore.errors.questDtos &&
              <p className="text-sm text-destructive mt-1">{taskStore.errors.questDtos}</p>}
            {(taskStore.dataRequest.questDtos && taskStore.dataRequest.questDtos.length > 0) && (
              <div className="p-4 rounded-md border flex flex-col gap-2">
                <div className="grid grid-cols-8 gap-2 bg-gray-50 p-2 rounded-md items-center">
                  <p className="text-sm font-bold">EventId</p>
                  <p className="text-sm font-bold">Period Type</p>
                  <p className="text-sm font-bold">Period Value</p>
                  <p className="text-sm font-bold">Min Count</p>
                  <p className="text-sm font-bold">Max Count</p>
                  <p className="text-sm font-bold text-center">Continuous?</p>
                  <p className="text-sm font-bold">Aggregate Type</p>
                  <p className="text-sm font-bold text-center">Action</p>
                </div>
                {(taskStore.dataRequest.questDtos).map((item, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-8 gap-2 bg-gray-50 p-2 rounded-md cursor-pointer items-center">
                      <span className="text-sm font-medium">
                         {item.eventId}
                      </span>
                      <Select
                        name="schedule.periodType"
                        value={item.periodUnit || ""}
                        error={taskStore.errors[`questDtos[${index}].periodType`]}
                        onValueChange={(value) =>
                          item.periodUnit = value
                        }>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Unit"/>
                        </SelectTrigger>
                        <SelectContent>
                          {(taskStore.objectList['questPeriodUnit'] || []).map((period) => (
                            <SelectItem key={period} value={period}>{period}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        autoComplete="off"
                        id="periodValue"
                        name="periodValue"
                        type="number"
                        value={item.periodValue || 0}
                        onChange={(e) => {
                          item.periodValue = parseInt(e.target.value)
                        }}
                        placeholder="Enter"
                      />
                      <Input
                        autoComplete="off"
                        id="minCount"
                        name="minCount"
                        type="number"
                        value={item.minCount || 0}
                        onChange={(e) => {
                          item.minCount = parseInt(e.target.value)
                        }}
                        placeholder="Enter"
                      />
                      <Input
                        autoComplete="off"
                        id="maxCount"
                        name="maxCount"
                        type="number"
                        value={item.maxCount || 0}
                        onChange={(e) => {
                          item.maxCount = parseInt(e.target.value)
                        }}
                        placeholder="Enter"
                      />
                      <div className="flex items-center justify-center">
                        <SwitchWrapper>
                          <Switch size={"sm"} checked={item.continuous}
                                  onCheckedChange={(checked) => item.continuous = checked}/>
                          <SwitchIndicator state="on"></SwitchIndicator>
                          <SwitchIndicator state="off"></SwitchIndicator>
                        </SwitchWrapper>
                      </div>
                      <Select
                        name="schedule.aggregateType"
                        value={item.aggregateType || ""}
                        error={taskStore.errors[`questDtos[${index}].aggregateType`]}
                        onValueChange={(value) =>
                          item.periodUnit = value
                        }>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"SUM"}>SUM</SelectItem>
                          <SelectItem value={"LAST"}>LAST</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center justify-center gap-2">
                        <Button data-tooltip-id="app-tooltip"
                                data-tooltip-content={"Delete reward"}
                                variant={"danger"}
                                size={"sm"} onClick={() => {
                          taskStore.dataRequest.questDtos.splice(index, 1)
                        }}>
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {taskStore.errors.items && (
              <div className="text-red-500 text-sm">
                {taskStore.errors.items}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            {taskStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </CardFooter>
      </Card>
      
      <PickItemModal isOpen={open} onClose={() => setOpen(false)}/>
    </div>
  )
})

export default CreateTask