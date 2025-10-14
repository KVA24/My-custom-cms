"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Edit, Plus, QrCode, Search, Trash2} from "lucide-react"
import CrudModal from "./components/CrudModal.tsx";
import accountStore from "./accountStore.ts";
import {observer} from "mobx-react-lite";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import CustomPagination from "@/components/common/CustomPagination.tsx";
import BadgeRender from "@/components/common/BadgeRender.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar: string
  createdAt: string
}

const AccountsPage = observer(() => {
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typeModal, setType] = useState<"create" | "edit" | "delete" | "showQr" | "changePass">("create")
  
  useEffect(() => {
    accountStore.clearState()
  }, []);
  
  useEffect(() => {
    if (!accountStore.searchKey) {
      accountStore.getList().then()
      return;
    }
    
    const handler = setTimeout(() => {
      accountStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [accountStore.searchKey, accountStore.size, accountStore.page]);
  
  const handlePage = (page: number) => {
    accountStore.page = page
  }
  
  const handleSize = (size: number) => {
    accountStore.page = 0
    accountStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("accounts.title")}</h1>
          <CustomBreadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accounts', isCurrent: true },
            ]}
          />
        </div>
        <Button className="flex items-center"
                onClick={() => {
                  accountStore.clearState()
                  setType("create")
                  setIsModalOpen(true)
                }}
                disabled={isModalOpen}>
          <Plus className="h-4 w-4"/>
          <span>{t("common.create")}</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("accounts.list")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                  autoComplete="off"
                placeholder={t("common.search")}
                value={accountStore.searchKey}
                onChange={(e) => accountStore.searchKey = e.target.value}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
            
            </div>
          </div>
          {accountStore.isLoading ?
            <div className="w-full flex justify-center">
              <LoadingSpinner size={"md"}/>
            </div>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(accountStore.lists || []).map((item, index) => (
                    <tr
                      key={index}
                      className=""
                    >
                      <td>
                        {item.id}
                      </td>
                      <td>
                        {item.username}
                      </td>
                      <td>
                        {item.role}
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
                            data-tooltip-content={"QrCode"}
                            loading={accountStore.isLoadingQr}
                            onClick={() => {
                              accountStore.getQr(item.username).then(
                                () => {
                                  setType("showQr")
                                  setIsModalOpen(true)
                                }
                              )
                            }}
                          >
                            <QrCode className="h-4 w-4"/>
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            data-tooltip-id="app-tooltip"
                            data-tooltip-content={t("common.edit")}
                            loading={accountStore.isLoadingGet}
                            onClick={() => {
                              accountStore.getDetail(item.id).then(
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
                              accountStore.id = item.username
                              accountStore.otpCode = ""
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
              
              {accountStore.lists.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No results found" : "No data available"}
                </div>
              )}
            </Fragment>
          }
          <CustomPagination
            currentPage={accountStore.page}
            totalPages={accountStore.totalPages}
            onChangePage={handlePage}
            currentSize={accountStore.size}
            onChangeSize={handleSize}
          />
        </CardContent>
      </Card>
      
      <CrudModal isOpen={isModalOpen} type={typeModal} onClose={() => setIsModalOpen(false)}/>
    </div>
  )
})

export default AccountsPage
