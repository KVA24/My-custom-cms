import React, {useEffect} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx"
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import itemStore, {DataRequest} from "@/pages/itemStores/itemStore.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {storeSchema} from "@/schemas/itemSchema.ts";
import {Button} from "@/components/ui/button.tsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {useParams} from "react-router";
import {observer} from "mobx-react-lite";
import {ChevronLeft, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import PickItemModal from "@/pages/itemStores/components/PickItemModal.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";

const EditItemStore = observer(() => {
  const {t} = useTranslation()
  const {id} = useParams<{ id: string }>()
  const [open, setOpen] = React.useState(false)
  
  useEffect(() => {
    itemStore.getDetail(id).then()
    itemStore.getListItems().then()
    itemStore.getListBudget().then()
  }, [])
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await storeSchema.validate(itemStore.dataRequest, {abortEarly: false})
      itemStore.errors = {}
      itemStore.update().then()
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
  
  const handleBack = () => {
    window.history.back()
  }
  
  return (
    <div className="flex flex-col gap-6">
      <CustomBreadcrumb
        items={[
          {label: 'Home', href: '/'},
          {label: 'Item Store', href: '/cms/item-store'},
          {label: 'Edit Item Store', isCurrent: true},
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Item Store</h1>
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
                value={itemStore.dataRequest?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={itemStore.errors.name}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                ServiceId <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="serviceId"
                name="serviceId"
                type="text"
                value={itemStore.dataRequest?.serviceId || ""}
                onChange={handleInputChange}
                placeholder="Enter"
                error={itemStore.errors.serviceId}
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
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                name="state"
                value={itemStore.dataRequest?.state || ""}
                error={itemStore.errors.state}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "state", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">InActive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="price"
                name="price"
                type="number"
                value={itemStore.dataRequest?.price}
                onChange={handleInputChange}
                placeholder="Enter"
                error={itemStore.errors.price}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Price Converted<span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="convertedPrice"
                name="convertedPrice"
                type="number"
                value={itemStore.dataRequest?.convertedPrice}
                onChange={handleInputChange}
                placeholder="Enter"
                error={itemStore.errors.convertedPrice}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Budget <span className="text-red-500">*</span>
              </Label>
              <Select
                name="poolBudgetId"
                value={itemStore.dataRequest?.poolBudgetId || ""}
                error={itemStore.errors.poolBudgetId}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "poolBudgetId", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Budget"/>
                </SelectTrigger>
                <SelectContent>
                  {(itemStore.listBudgets || []).map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                RegType <span className="text-red-500">*</span>
              </Label>
              <Select
                name="regType"
                value={itemStore.dataRequest?.regType || ""}
                error={itemStore.errors.regType}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {name: "regType", value},
                  } as React.ChangeEvent<HTMLInputElement>)
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Type"/>
                </SelectTrigger>
                <SelectContent>
                  {(itemStore.listRegType || []).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label variant="secondary">
                Display Order<span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={itemStore.dataRequest?.displayOrder}
                onChange={handleInputChange}
                placeholder="Enter"
                error={itemStore.errors.displayOrder}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label variant="secondary">
              Items <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center justify-start">
              <Button variant="primary" onClick={() => {
                itemStore.listItemsSelected = [...itemStore.dataRequest.items]
                setOpen(true)
              }}>
                Add items
              </Button>
            </div>
            {(itemStore.dataRequest.items && itemStore.dataRequest.items.length > 0) && (
              <div className="p-4 rounded-md border flex flex-col gap-2">
                <div className="grid grid-cols-5 gap-2 bg-gray-50 p-2 rounded-md items-center">
                  <p className="font-bold">Name</p>
                  <p className="font-bold">Quantity</p>
                  <p className="font-bold">UnitPrice</p>
                  <p className="font-bold">DisplayOrder</p>
                  <p className="font-bold text-center">Action</p>
                </div>
                {(itemStore.dataRequest.items).map((item, index) => (
                  <div key={index}
                       className="grid grid-cols-5 gap-2 bg-gray-50 p-2 rounded-md cursor-pointer items-center">
                    <span className="text-sm font-medium">
                       {item.name || item.itemName} - {item.code || item.itemCode}
                    </span>
                    <Input
                      autoComplete="off"
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={item.quantity || 0}
                      onChange={(e) => {
                        item.quantity = parseInt(e.target.value)
                      }}
                      placeholder="Enter"
                    />
                    <Input
                      autoComplete="off"
                      id="unitPrice"
                      name="unitPrice"
                      type="number"
                      value={item.unitPrice || 0}
                      onChange={(e) => {
                        item.unitPrice = parseInt(e.target.value)
                      }}
                      placeholder="Enter"
                    />
                    <Input
                      autoComplete="off"
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      value={item.displayOrder || 0}
                      onChange={(e) => {
                        item.displayOrder = parseInt(e.target.value)
                      }}
                      placeholder="Enter"
                    />
                    <div className="flex items-center justify-center">
                      <Button variant={"danger"} size={"sm"} onClick={() => {
                        itemStore.dataRequest.items.splice(index, 1)
                      }}>
                        <Trash2/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {itemStore.errors.items && (
              <div className="text-red-500 text-sm">
                {itemStore.errors.items}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            {itemStore.isLoadingBt ? <LoadingSpinner size={"sm"}/> : t('common.confirm')}
          </Button>
        </CardFooter>
      </Card>
      
      <PickItemModal isOpen={open} onClose={() => setOpen(false)}/>
    </div>
  )
})

export default EditItemStore