"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Edit, Plus, Trash2, Undo2Icon} from "lucide-react"
import CrudModal from "./components/CrudModal.tsx";
import budgetStore from "./budgetStore.ts";
import {observer} from "mobx-react-lite";
import CustomPagination from "@/components/common/CustomPagination.tsx";
import {numberFormat} from "@/lib/utils.ts";
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

const PoolBudgetPage = observer(() => {
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typeModal, setType] = useState<"create" | "edit" | "delete" | "change">("create")
  
  function handleCreate() {
    budgetStore.clearState()
    setType("create")
    setIsModalOpen(true)
  }
  
  function handleEdit(id: string) {
    budgetStore.getDetail(id).then(() => {
      setType("edit")
      setIsModalOpen(true)
    })
  }
  
  function updateAmount(id: string) {
    budgetStore.clearState()
    budgetStore.id = id
    setType("change")
    setIsModalOpen(true)
  }
  
  useEffect(() => {
    if (!budgetStore.searchKey) {
      budgetStore.getList().then()
      return;
    }
    
    const handler = setTimeout(() => {
      budgetStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [budgetStore.searchKey, budgetStore.page, budgetStore.size]);
  
  const handlePage = (page: number) => {
    budgetStore.page = page
  }
  
  const handleSize = (size: number) => {
    budgetStore.page = 0
    budgetStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-100 tracking-tight">Pool Budget</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Pool Budget', isCurrent: true},
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
          <CardTitle className="text-xl">Pool Budget List</CardTitle>
        </CardHeader>
        <CardContent>
          {/*<div*/}
          {/*  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">*/}
          {/*  <div className="relative flex-1 max-w-sm">*/}
          {/*    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>*/}
          {/*    <Input
                  autoComplete="off"*/}
          {/*      placeholder={t("common.search")}*/}
          {/*      value={budgetStore.searchKey}*/}
          {/*      onChange={(e) => budgetStore.searchKey = e.target.value}*/}
          {/*      className="pl-10"*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div className="flex gap-2">*/}
          {/*  */}
          {/*  </div>*/}
          {/*</div>*/}
          {budgetStore.isLoading ?
            <TableSkeleton rows={5} columns={3}/>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(budgetStore.lists || []).map((item, index) => (
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
                        {numberFormat(item.value)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.updateAmount")}
                            onClick={() => updateAmount(item.id)}
                          >
                            <Undo2Icon className="h-4 w-4"/>
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.edit")}
                            loading={budgetStore.isLoadingGet}
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
                              budgetStore.id = item.id
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
              
              {budgetStore.lists.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No results found" : "No data available"}
                </div>
              )}
            </Fragment>
          }
          <CustomPagination
            currentPage={budgetStore.page}
            totalPages={budgetStore.totalPages}
            onChangePage={handlePage}
            currentSize={budgetStore.size}
            onChangeSize={handleSize}
          />
        </CardContent>
      </Card>
      
      <CrudModal isOpen={isModalOpen} type={typeModal} onClose={() => setIsModalOpen(false)}/>
    </div>
  )
})

export default PoolBudgetPage
