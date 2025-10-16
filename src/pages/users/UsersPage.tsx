"use client"

import {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Search} from "lucide-react"
import userStore from "./userStore"
import {observer} from "mobx-react-lite"
import CustomPagination from "@/components/common/CustomPagination.tsx"
import BadgeRender from "@/components/common/BadgeRender.tsx"
import {useNavigate} from "react-router-dom"
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx"
import TableSkeleton from "@/components/common/TableSkeleton.tsx"

const UsersPage = observer(() => {
  const {t} = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    userStore.clearState()
  }, [])
  
  useEffect(() => {
    if (!userStore.searchKey) {
      userStore.getList().then()
      return
    }
    
    const handler = setTimeout(() => {
      userStore.getList().then()
    }, 500)
    
    return () => clearTimeout(handler)
  }, [userStore.searchKey, userStore.page, userStore.size])
  
  const handlePage = (page: number) => {
    userStore.page = page
  }
  
  const handleSize = (size: number) => {
    userStore.page = 0
    userStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("users.title")}</h1>
          <CustomBreadcrumb
            items={[
              {label: "Home", href: "/"},
              {label: "Users", isCurrent: true},
            ]}
          />
        </div>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t("users.list")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input
                autoComplete="off"
                placeholder="Search by Phone number"
                value={userStore.searchKey}
                onChange={(e) => (userStore.searchKey = e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2"></div>
          </div>
          
          {userStore.isLoading ? (
            <TableSkeleton rows={5} columns={3}/>
          ) : (
            <Fragment>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(userStore.lists || []).map((item, index) => (
                    <tr
                      key={index}
                      className=""
                      onClick={() => {
                        navigate(`/cms/users/${item.id}`)
                      }}
                    >
                      <td>
                        <span className="font-mono text-sm">{item.id}</span>
                      </td>
                      <td>
                        <span className="font-medium">{item.username}</span>
                      </td>
                      <td>
                        <BadgeRender status={item.state}/>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              
              {userStore.lists?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {userStore.searchKey ? "No results found" : "No data available"}
                  </div>
                </div>
              )}
            </Fragment>
          )}
          
          <CustomPagination
            currentPage={userStore.page}
            totalPages={userStore.totalPages}
            onChangePage={handlePage}
            currentSize={userStore.size}
            onChangeSize={handleSize}
          />
        </CardContent>
      </Card>
    </div>
  )
})

export default UsersPage
