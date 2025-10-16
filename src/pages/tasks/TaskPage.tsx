"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Edit, Plus, RotateCcw, Search, Trash2, XIcon} from "lucide-react"
import CrudModal from "./components/CrudModal.tsx";
import taskStore from "./taskStore.ts";
import {observer} from "mobx-react-lite";
import CustomPagination from "@/components/common/CustomPagination.tsx";
import {useNavigate} from "react-router-dom";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import {format} from "date-fns";
import BadgeRender from "@/components/common/BadgeRender.tsx";
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

const TaskPage = observer(() => {
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typeModal, setType] = useState<"create" | "edit" | "delete" | "updateState">("create")
  const navigate = useNavigate()
  
  function handleCreate() {
    taskStore.clearState()
    navigate("/cms/tasks/create")
  }
  
  function handleEdit(id: string) {
    navigate(`/cms/tasks/edit/${id}`)
  }
  
  useEffect(() => {
    taskStore.clearState()
  }, []);
  
  useEffect(() => {
    if (!taskStore.searchKey) {
      taskStore.getList().then()
      return;
    }
    
    const handler = setTimeout(() => {
      taskStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [taskStore.searchKey, taskStore.page, taskStore.size]);
  
  const handlePage = (page: number) => {
    taskStore.page = page
  }
  
  const handleSize = (size: number) => {
    taskStore.page = 0
    taskStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-100 tracking-tight">Tasks</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Tasks', isCurrent: true},
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
          <CardTitle className="text-xl">Tasks List</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                autoComplete="off"
                placeholder={t("common.search")}
                value={taskStore.searchKey}
                onChange={(e) => taskStore.searchKey = e.target.value}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
            
            </div>
          </div>
          {taskStore.isLoading ?
            <TableSkeleton rows={5} columns={3}/>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(taskStore.lists || []).map((item, index) => (
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
                        {format(item.startDate, "dd/MM/yyyy")}
                      </td>
                      <td>
                        {item.isNoEndDate ? <XIcon/> : format(item.startDate, "dd/MM/yyyy")}
                      </td>
                      <td>
                        <BadgeRender status={item.state}/>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.updateState")}
                            loading={taskStore.isLoadingGet}
                            onClick={() => {
                              taskStore.id = item.id
                              setType("updateState")
                              setIsModalOpen(true)
                            }}
                          >
                            <RotateCcw className="h-4 w-4"/>
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.edit")}
                            loading={taskStore.isLoadingGet}
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
                              taskStore.id = item.id
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
              
              {taskStore.lists.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No results found" : "No data available"}
                </div>
              )}
            </Fragment>
          }
          <CustomPagination
            currentPage={taskStore.page}
            totalPages={taskStore.totalPages}
            onChangePage={handlePage}
            currentSize={taskStore.size}
            onChangeSize={handleSize}
          />
        </CardContent>
      </Card>
      
      <CrudModal isOpen={isModalOpen} type={typeModal} onClose={() => setIsModalOpen(false)}/>
    </div>
  )
})

export default TaskPage
