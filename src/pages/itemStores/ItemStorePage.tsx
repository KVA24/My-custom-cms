"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Edit, Plus, Search, Trash2} from "lucide-react"
import CrudModal from "./components/CrudModal.tsx";
import itemStore from "./itemStore.ts";
import {observer} from "mobx-react-lite";
import CustomPagination from "@/components/common/CustomPagination.tsx";
import {formatNumber} from "@/lib/utils.ts";
import {useNavigate} from "react-router-dom";
import BadgeRender from "@/components/common/BadgeRender.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import TableSkeleton from "@/components/common/TableSkeleton.tsx";

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar: string
  createdAt: string
}

const ItemStorePage = observer(() => {
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typeModal, setType] = useState<"create" | "edit" | "delete">("create")
  const navigate = useNavigate()
  
  function handleCreate() {
    itemStore.clearState()
    navigate("/cms/item-store/create")
  }
  
  function handleEdit(id: string) {
    navigate(`/cms/item-store/edit/${id}`)
  }
  
  useEffect(() => {
    itemStore.clearState()
  }, []);
  
  useEffect(() => {
    if (!itemStore.searchKey) {
      itemStore.getList().then()
      return;
    }
    
    const handler = setTimeout(() => {
      itemStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [itemStore.searchKey, itemStore.page, itemStore.size]);
  
  const handlePage = (page: number) => {
    itemStore.page = page
  }
  
  const handleSize = (size: number) => {
    itemStore.page = 0
    itemStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-100 tracking-tight">Item Store</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Item Store', isCurrent: true},
            ]}
          />
        </div>
        <Button className="flex items-center"
                onClick={handleCreate}
                disabled={isModalOpen}>
          <Plus className="h-4 w-4"/>
          <span>{t("common.create")}</span>
        </Button>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Item Store List</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                autoComplete="off"
                placeholder={t("common.search")}
                value={itemStore.searchKey}
                onChange={(e) => itemStore.searchKey = e.target.value}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
            
            </div>
          </div>
          {itemStore.isLoading ?
            <TableSkeleton rows={5} columns={3}/>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>ServiceId</th>
                    <th>Type</th>
                    <th>Reg Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(itemStore.lists || []).map((item, index) => (
                    <tr
                      key={index}
                      className=""
                    >
                      <td>
                        {item.id}
                      </td>
                      <td>
                        {item.name}
                      </td>
                      <td>
                        {item.serviceId}
                      </td>
                      <td>
                        {item.type}
                      </td>
                      <td>
                        {item.regType}
                      </td>
                      <td>
                        {formatNumber(item.price)}
                      </td>
                      <td>
                        <BadgeRender status={item.state}/>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.edit")}
                            loading={itemStore.isLoadingGet}
                            onClick={() => handleEdit(item.id)}
                          >
                            <Edit className="h-4 w-4"/>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.delete")}
                            onClick={() => {
                              itemStore.id = item.id
                              setType("delete")
                              setIsModalOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              
              {itemStore.lists.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No results found" : "No data available"}
                </div>
              )}
            </Fragment>
          }
          <CustomPagination
            currentPage={itemStore.page}
            totalPages={itemStore.totalPages}
            onChangePage={handlePage}
            currentSize={itemStore.size}
            onChangeSize={handleSize}
          />
        </CardContent>
      </Card>
      
      <CrudModal isOpen={isModalOpen} type={typeModal} onClose={() => setIsModalOpen(false)}/>
    </div>
  )
})

export default ItemStorePage
