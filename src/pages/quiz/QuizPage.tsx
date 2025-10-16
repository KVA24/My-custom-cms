"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Edit, Plus, Search, Trash2} from "lucide-react"
import CrudModal from "./CrudModal.tsx";
import quizStore from "./quizStore.ts";
import {observer} from "mobx-react-lite";
import CustomPagination from "@/components/common/CustomPagination.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import BadgeRender from "@/components/common/BadgeRender.tsx";
import TableSkeleton from "@/components/common/TableSkeleton.tsx";
import languageStore from "@/pages/languages/languageStore.ts";
import {FileImport} from "@/components/common/FileImport.tsx";
import toastUtil from "@/lib/toastUtil.ts";

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar: string
  createdAt: string
}

const QuizPage = observer(() => {
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typeModal, setType] = useState<"create" | "edit" | "delete">("create")
  
  useEffect(() => {
    quizStore.clearState()
  }, []);
  
  useEffect(() => {
    quizStore.clearState()
    if (!quizStore.searchKey) {
      quizStore.getList().then()
      return;
    }
    
    const handler = setTimeout(() => {
      quizStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [quizStore.searchKey, quizStore.page, quizStore.size]);
  
  const handlePage = (page: number) => {
    quizStore.page = page
  }
  
  const handleSize = (size: number) => {
    quizStore.page = 0
    quizStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-100 tracking-tight">Quiz</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Quiz', isCurrent: true},
            ]}
          />
        </div>
        <Button className="flex items-center"
                onClick={() => {
                  languageStore.getAll().then()
                  quizStore.clearState()
                  setType("create")
                  setIsModalOpen(true)
                }}
                disabled={isModalOpen}>
          <Plus className="h-4 w-4"/>
          <span>{t("common.create")}</span>
        </Button>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl">Quiz List</CardTitle>
          <FileImport
            accept=".xlsx, .xls, .csv"
            showPreview={false}
            uploadUrl="/v1/portal/quiz/import"
            onFileSelect={(file) => {
              console.log(file)
            }}
            onUploadError={(error) => toastUtil.error(error)}
            onUploadComplete={() => quizStore.getList().then()}
          />
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                autoComplete="off"
                placeholder={t("common.search")}
                value={quizStore.searchKey}
                onChange={(e) => quizStore.searchKey = e.target.value}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
            
            </div>
          </div>
          {quizStore.isLoading ?
            <TableSkeleton rows={5} columns={3}/>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>True Answer</th>
                    <th>False Answer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(quizStore.lists || []).map((item, index) => (
                    <tr
                      key={index}
                      className=""
                    >
                      <td>
                        {item.id}
                      </td>
                      <td>
                        {item.question}
                      </td>
                      <td>
                        {item.trueAnswer}
                      </td>
                      <td>
                        {item.falseAnswers?.map((falseAnswer, index) => (
                          <p key={index}>- {falseAnswer}</p>
                        ))}
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
                            loading={quizStore.isLoadingGet}
                            onClick={() => {
                              languageStore.getAll().then()
                              quizStore.getDetail(item.id).then(
                                () => {
                                  setType("edit")
                                  setIsModalOpen(true)
                                }
                              )
                            }}
                          >
                            <Edit className="h-4 w-4"/>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.delete")}
                            onClick={() => {
                              quizStore.id = item.id
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
              
              {quizStore.lists.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No results found" : "No data available"}
                </div>
              )}
            </Fragment>
          }
          <CustomPagination
            currentPage={quizStore.page}
            totalPages={quizStore.totalPages}
            onChangePage={handlePage}
            currentSize={quizStore.size}
            onChangeSize={handleSize}
          />
        </CardContent>
      </Card>
      
      <CrudModal isOpen={isModalOpen} type={typeModal} onClose={() => setIsModalOpen(false)}/>
    </div>
  )
})

export default QuizPage
