import React, {useEffect} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx"
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import eventStore, {DataRequest} from "../eventStore.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {eventSchema} from "@/schemas/eventSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {observer} from "mobx-react-lite";
import {ChevronLeft, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import {Switch, SwitchIndicator, SwitchWrapper} from "@/components/ui/switch.tsx";

const CreateEvent = observer(() => {
  const {t} = useTranslation()
  
  useEffect(() => {
    eventStore.getDataType().then()
    eventStore.getOperator().then()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    
    eventStore.dataRequest = {
      ...eventStore.dataRequest,
      [name]: value,
    };
    
    if (eventStore.errors[name as keyof DataRequest]) {
      eventStore.errors = {
        ...eventStore.errors,
        [name]: undefined,
      };
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await eventSchema.validate(eventStore.dataRequest, {abortEarly: false})
      eventStore.errors = {}
      eventStore.create().then()
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Partial<DataRequest> = {}
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof DataRequest] = err.message
        })
        eventStore.errors = validationErrors
        console.log(eventStore.errors)
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
          {label: 'Events', href: '/cms/events'},
          {label: 'Create Event', isCurrent: true},
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Event</h1>
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
                value={eventStore.dataRequest?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={eventStore.errors.name}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                ExternalId <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="externalId"
                name="externalId"
                type="text"
                value={eventStore.dataRequest?.externalId || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={eventStore.errors.externalId}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                name="state"
                value={eventStore.dataRequest?.state || ""}
                error={eventStore.errors.state}
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
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Parameterized ? <span className="text-red-500">*</span>
              </Label>
              <div className="w-full h-full flex items-center">
                <SwitchWrapper>
                  <Switch size={"sm"} checked={eventStore.dataRequest.parameterized}
                          onCheckedChange={(checked) => eventStore.dataRequest.parameterized = checked}/>
                  <SwitchIndicator state="on"></SwitchIndicator>
                  <SwitchIndicator state="off"></SwitchIndicator>
                </SwitchWrapper>
              </div>
            </div>
          </div>
          {eventStore.dataRequest.parameterized &&
            <div className="flex flex-col gap-4">
              <Label variant="secondary">
                Params {eventStore.dataRequest.parameterized && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex items-center justify-start">
                <Button variant="primary" onClick={() => {
                  eventStore.dataRequest.eventParams.push({
                    name: '',
                    externalId: '',
                    dataType: '',
                    operator: '',
                    value: 0
                  })
                }}>
                  Add param
                </Button>
              </div>
              {eventStore.errors.eventParams &&
                <p className="text-sm text-destructive mt-1">{eventStore.errors.eventParams}</p>}
              {(eventStore.dataRequest.eventParams && eventStore.dataRequest.eventParams.length > 0) && (
                <div className="p-4 rounded-md border flex flex-col gap-2">
                  <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-md items-center">
                    <p className="text-sm font-bold">Name</p>
                    <p className="text-sm font-bold">ExternalId</p>
                    <p className="text-sm font-bold">Data Type</p>
                    <p className="text-sm font-bold">Operator</p>
                    <p className="text-sm font-bold">Value</p>
                    <p className="text-sm font-bold text-center">Action</p>
                  </div>
                  {(eventStore.dataRequest.eventParams).map((item, index) => (
                    <div key={index}>
                      <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-md cursor-pointer items-center">
                        <Input
                          autoComplete="off"
                          id="name"
                          name="name"
                          type="text"
                          value={item.name || ''}
                          onChange={(e) => {
                            item.name = e.target.value
                          }}
                          placeholder="Enter"
                        />
                        <Input
                          autoComplete="off"
                          id="externalId"
                          name="externalId"
                          type="text"
                          value={item.externalId || ''}
                          onChange={(e) => {
                            item.externalId = e.target.value
                          }}
                          placeholder="Enter"
                        />
                        <Select
                          name="schedule.dataType"
                          value={item.dataType || ""}
                          error={eventStore.errors[`eventParams[${index}].dataType`]}
                          onValueChange={(value) =>
                            item.dataType = value
                          }>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose Type"/>
                          </SelectTrigger>
                          <SelectContent>
                            {eventStore.dataTypeList.map((type: string) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          name="schedule.operator"
                          value={item.operator || ""}
                          error={eventStore.errors[`eventParams[${index}].operator`]}
                          onValueChange={(value) =>
                            item.operator = value
                          }>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose Operator"/>
                          </SelectTrigger>
                          <SelectContent>
                            {eventStore.operatorList.map((operator: string) => (
                              <SelectItem key={operator} value={operator}>{operator}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          autoComplete="off"
                          id="value"
                          name="value"
                          type="number"
                          value={item.value || 0}
                          onChange={(e) => {
                            item.value = parseInt(e.target.value)
                          }}
                          placeholder="Enter"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <Button data-tooltip-id="app-tooltip"
                                  data-tooltip-content={"Delete reward"}
                                  variant={"danger"}
                                  size={"sm"} onClick={() => {
                            eventStore.dataRequest.eventParams.splice(index, 1)
                          }}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {eventStore.errors.items && (
                <div className="text-red-500 text-sm">
                  {eventStore.errors.items}
                </div>
              )}
            </div>
          }
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            {eventStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
})

export default CreateEvent