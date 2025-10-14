import React, {useEffect} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx"
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import taskStore, {DataRequest} from "../taskStore.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {poolSchema} from "@/schemas/poolSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {useParams} from "react-router";
import {observer} from "mobx-react-lite";
import {ChevronLeft, PlusIcon, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import PickItemModal from "./PickItemModal.tsx";
import {Switch, SwitchIndicator, SwitchWrapper} from "@/components/ui/switch.tsx";
import DateTimePicker from "@/components/ui/dateTimePicker.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";

const EditTask = observer(() => {
  const {t} = useTranslation()
  const {id} = useParams<{ id: string }>()
  const [open, setOpen] = React.useState(false)
  
  useEffect(() => {
    taskStore.getListRewards().then()
    taskStore.getListFallbackPool().then()
    taskStore.getListBudget().then()
    taskStore.getDetail(id).then()
  }, [])
  
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
      await poolSchema.validate(taskStore.dataRequest, {abortEarly: false})
      taskStore.errors = {}
      taskStore.update().then()
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
          {label: 'Pools', href: '/cms/pool'},
          {label: 'Create Pool', isCurrent: true},
        ]}
      />
      <Card>
        <CardHeader className="flex items-center justify-start gap-2">
          <Button
            variant="secondary"
            size="sm"
            data-tooltip-id="app-tooltip"
            data-tooltip-content={t("common.back")}
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4"/>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Pool</h1>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Code <span className="text-red-500">*</span>
              </Label>
              <Input
                  autoComplete="off"
                id="code"
                name="code"
                type="text"
                value={taskStore.dataRequest?.code || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={taskStore.errors.code}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Fallback Pool
              </Label>
              <Select
                name="fallbackPoolId"
                value={taskStore.dataRequest?.fallbackPoolId || ""}
                error={taskStore.errors.fallbackPoolId}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "fallbackPoolId", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Pool"/>
                </SelectTrigger>
                <SelectContent>
                  {(taskStore.listFallbackPools || []).map((item, index) => (
                    <SelectItem key={index} value={item.id}>{item.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Budget <span className="text-red-500">*</span>
              </Label>
              <Select
                name="poolBudgetId"
                value={taskStore.dataRequest?.poolBudgetId || ""}
                error={taskStore.errors.poolBudgetId}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "poolBudgetId", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Budget"/>
                </SelectTrigger>
                <SelectContent>
                  {(taskStore.listBudgets || []).map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
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
                value={taskStore.dataRequest?.state || ""}
                error={taskStore.errors.state}
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
                  <SelectItem value={"DISABLED"}>Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label variant="secondary">
              Rewards <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center justify-start">
              <Button variant="primary" onClick={() => {
                taskStore.listRewardsSelected = [...taskStore.dataRequest.rewardMaps]
                setOpen(true)
              }}>
                Add rewards
              </Button>
            </div>
            {taskStore.errors.rewardMaps &&
              <p className="text-sm text-destructive mt-1">{taskStore.errors.rewardMaps}</p>}
            {(taskStore.dataRequest.rewardMaps && taskStore.dataRequest.rewardMaps.length > 0) && (
              <div className="p-4 rounded-md border flex flex-col gap-2">
                <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-md items-center">
                  <p className="text-sm font-bold">Name</p>
                  <p className="text-sm font-bold">Period Type</p>
                  <p className="text-sm font-bold">Weight</p>
                  <p className="text-sm font-bold text-center">Is Activate?</p>
                  <p className="text-sm font-bold text-center">Is Unlimited?</p>
                  <p className="text-sm font-bold text-center">Action</p>
                </div>
                {(taskStore.dataRequest.rewardMaps).map((item, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-md cursor-pointer items-center">
                      <span className="text-sm font-medium">
                         {item.rewardName}
                      </span>
                      <Select
                        name="schedule.periodType"
                        value={item.periodType || ""}
                        error={taskStore.errors[`rewardMaps[${index}].periodType`]}
                        onValueChange={(value) =>
                          item.periodType = value
                        }>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Type"/>
                        </SelectTrigger>
                        <SelectContent>
                          {taskStore.periodTypes.map((period) => (
                            <SelectItem key={period} value={period}>{period}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                  autoComplete="off"
                        id="weight"
                        name="weight"
                        type="number"
                        value={item.weight || 0}
                        onChange={(e) => {
                          item.weight = parseInt(e.target.value)
                        }}
                        placeholder="Enter"
                      />
                      <div className="flex items-center justify-center">
                        <SwitchWrapper>
                          <Switch size={"sm"} checked={item.isActivate}
                                  onCheckedChange={(checked) => item.isActivate = checked}/>
                          <SwitchIndicator state="on"></SwitchIndicator>
                          <SwitchIndicator state="off"></SwitchIndicator>
                        </SwitchWrapper>
                      </div>
                      <div className="flex items-center justify-center">
                        <SwitchWrapper>
                          <Switch size={"sm"} checked={item.isUnlimited}
                                  onCheckedChange={(checked) => item.isUnlimited = checked}/>
                          <SwitchIndicator state="on"></SwitchIndicator>
                          <SwitchIndicator state="off"></SwitchIndicator>
                        </SwitchWrapper>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Button data-tooltip-id="app-tooltip"
                                data-tooltip-content={"Add schedule"}
                                variant={"primary"}
                                size={"sm"} onClick={() => {
                          item.poolRewardSchedules.push({
                            poolRewardMapId: "",
                            periodType: "",
                            quantity: 0,
                            startAt: new Date(),
                            endAt: new Date(),
                            state: ""
                          })
                        }}>
                          <PlusIcon className="h-4 w-4"/>
                        </Button>
                        <Button data-tooltip-id="app-tooltip"
                                data-tooltip-content={"Delete reward"}
                                variant={"danger"}
                                size={"sm"} onClick={() => {
                          taskStore.dataRequest.rewardMaps.splice(index, 1)
                        }}>
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 mx-4">
                      {item.poolRewardSchedules && item.poolRewardSchedules.length > 0 && (
                        <div className="p-4 rounded-md border flex flex-col gap-2">
                          <div className="grid grid-cols-6 gap-2 p-2 border rounded-md">
                            <p className="font-medium text-sm">Period Type</p>
                            <p className="font-medium text-sm">Quantity</p>
                            <p className="font-medium text-sm">Start At</p>
                            <p className="font-medium text-sm">End At</p>
                            <p className="font-medium text-sm">State</p>
                            <p className="font-medium text-sm text-center">Action</p>
                          </div>
                          {item.poolRewardSchedules.map((schedule, jndex) => (
                            <div key={jndex}
                                 className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-md cursor-pointer items-center">
                              <Select
                                name="schedule.periodType"
                                value={schedule.periodType || ""}
                                onValueChange={(value) =>
                                  schedule.periodType = value
                                }>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Choose Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                  {taskStore.periodTypeSchedule.map((period) => (
                                    <SelectItem key={period} value={period}>{period}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                  autoComplete="off"
                                id="schedule.quantity"
                                name="quantity"
                                type="number"
                                value={schedule.quantity || 0}
                                onChange={(e) => {
                                  schedule.quantity = parseInt(e.target.value)
                                }}
                                placeholder="Enter"
                              />
                              <DateTimePicker
                                value={schedule.startAt}
                                onChange={(dateTime) => {
                                  schedule.startAt = dateTime ?? new Date();
                                }}
                              />
                              <DateTimePicker
                                value={schedule.endAt}
                                onChange={(dateTime) => {
                                  schedule.endAt = dateTime ?? new Date();
                                }}
                              />
                              {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
                              {/*  <Popover>*/}
                              {/*    <PopoverTrigger asChild>*/}
                              {/*      <Button*/}
                              {/*        mode="input"*/}
                              {/*        variant="outline"*/}
                              {/*        id="date"*/}
                              {/*        className={cn(*/}
                              {/*          'w-full data-[state=open]:border-primary',*/}
                              {/*          !schedule.startAt && 'text-muted-foreground',*/}
                              {/*        )}*/}
                              {/*      >*/}
                              {/*        <CalendarDays className="-ms-0.5"/>*/}
                              {/*        {schedule.startAt ? format(schedule.startAt, 'dd/MM/yyyy') :*/}
                              {/*          <span>Pick a date</span>}*/}
                              {/*      </Button>*/}
                              {/*    </PopoverTrigger>*/}
                              {/*    <PopoverContent className="w-auto p-0" align="start">*/}
                              {/*      <Calendar*/}
                              {/*        initialFocus*/}
                              {/*        mode="single"*/}
                              {/*        defaultMonth={schedule.startAt}*/}
                              {/*        selected={schedule.startAt}*/}
                              {/*        onSelect={(date) => schedule.startAt = date}*/}
                              {/*        numberOfMonths={1}*/}
                              {/*      />*/}
                              {/*    </PopoverContent>*/}
                              {/*  </Popover>*/}
                              {/*</div>*/}
                              {/*<div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">*/}
                              {/*  <Popover>*/}
                              {/*    <PopoverTrigger asChild>*/}
                              {/*      <Button*/}
                              {/*        mode="input"*/}
                              {/*        variant="outline"*/}
                              {/*        id="date"*/}
                              {/*        className={cn(*/}
                              {/*          'w-full data-[state=open]:border-primary',*/}
                              {/*          !schedule.endAt && 'text-muted-foreground',*/}
                              {/*        )}*/}
                              {/*      >*/}
                              {/*        <CalendarDays className="-ms-0.5"/>*/}
                              {/*        {schedule.endAt ? format(schedule.endAt, 'dd/MM/yyyy') : <span>Pick a date</span>}*/}
                              {/*      </Button>*/}
                              {/*    </PopoverTrigger>*/}
                              {/*    <PopoverContent className="w-auto p-0" align="start">*/}
                              {/*      <Calendar*/}
                              {/*        initialFocus*/}
                              {/*        mode="single" // Single date selection*/}
                              {/*        defaultMonth={schedule.endAt}*/}
                              {/*        selected={schedule.endAt}*/}
                              {/*        onSelect={(date) => schedule.endAt = date}*/}
                              {/*        numberOfMonths={1}*/}
                              {/*      />*/}
                              {/*    </PopoverContent>*/}
                              {/*  </Popover>*/}
                              {/*</div>*/}
                              <Select
                                name="schedule.state"
                                value={schedule.state || ""}
                                onValueChange={(value) =>
                                  schedule.state = value
                                }>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Choose State"/>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={"ACTIVE"}>Active</SelectItem>
                                  <SelectItem value={"DISABLED"}>Disabled</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center justify-center gap-2">
                                <Button data-tooltip-id="app-tooltip"
                                        data-tooltip-content={"Delete schedule"}
                                        variant={"danger"}
                                        size={"sm"} onClick={() => {
                                  item.poolRewardSchedules.splice(jndex, 1)
                                }}>
                                  <Trash2 className="h-4 w-4"/>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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

export default EditTask