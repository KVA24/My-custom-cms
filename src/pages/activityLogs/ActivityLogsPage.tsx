"use client"

import React, {Fragment, useEffect} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Search, Undo} from "lucide-react"
import logStore from "./logStore.ts";
import {observer} from "mobx-react-lite";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {dateTimeFormat} from "@/lib/utils.ts";
import SimplePagination from "@/components/common/SimplePagination.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import DateRangePicker from "@/components/ui/dateRangePicker.tsx";

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar: string
  createdAt: string
}

const ActivityLogsPage = observer(() => {
  const {t} = useTranslation()
  
  useEffect(() => {
    logStore.clearState()
  }, []);
  
  useEffect(() => {
    if (!logStore.searchKey) {
      logStore.getList().then()
      return;
    }
    
    const handler = setTimeout(() => {
      logStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [logStore.searchKey, logStore.page, logStore.size, logStore.searchType, logStore.searchRole, logStore.gte, logStore.lte]);
  
  const handlePageChange = (action: string) => {
    if (action === 'next') {
      logStore.previous = undefined
      logStore.next = logStore.metadata?.next
      logStore.getList().then()
    } else if (action === 'prev') {
      logStore.previous = logStore.metadata?.pre
      logStore.next = undefined
      logStore.getList().then()
    }
  }
  
  const handleSizeChange = (size: number) => {
    logStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Action Logs</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Action Logs', isCurrent: true},
            ]}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Logs List</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                  autoComplete="off"
                placeholder={t("common.search")}
                value={logStore.searchKey}
                onChange={(e) => logStore.searchKey = e.target.value}
                className="pl-10"
              />
            </div>
            <div className="flex w-full">
              <Select
                name="role"
                value={logStore.searchRole || ""}
                onValueChange={(value) =>
                  logStore.searchRole = value
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Role"/>
                </SelectTrigger>
                <SelectContent>
                  {logStore.roleList?.map((item, index) => (
                    <SelectItem key={index} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full">
              <Select
                name="role"
                value={logStore.searchType || ""}
                onValueChange={(value) =>
                  logStore.searchType = value
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Type"/>
                </SelectTrigger>
                <SelectContent>
                  {logStore.actionList?.map((item, index) => (
                    <SelectItem key={index} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full">
              <DateRangePicker
                start={logStore.gte}
                end={logStore.lte}
                onApply={(range) => {
                  logStore.gte = range?.from
                  logStore.lte = range?.to
                }}
              />
            </div>
            <div className="flex w-full justify-start items-center gap-2">
              <Button variant={"warning"}
                      onClick={() => {
                        logStore.clearState()
                        logStore.getList().then()
                      }}
              >
                <Undo/> Reset
              </Button>
            </div>
          </div>
          {logStore.isLoading ?
            <div className="w-full flex justify-center">
              <LoadingSpinner size={"md"}/>
            </div>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Module</th>
                    <th>ActionType</th>
                    <th>Path</th>
                    <th>Time</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(logStore.lists || []).map((item, index) => (
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
                        {item.accountRole}
                      </td>
                      <td>
                        {item.module}
                      </td>
                      <td>
                        {item.actionType}
                      </td>
                      <td>
                        {item.pathUri}
                      </td>
                      <td>
                        {dateTimeFormat(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              
              {
                logStore.lists?.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {logStore.searchKey ? "No results found" : "No data available"}
                  </div>
                )
              }
            </Fragment>
          }
          <SimplePagination
            disabledNext={!logStore.metadata?.hasNextPage}
            disabledPre={!logStore.metadata?.hasPrePage}
            currentSize={logStore.size}
            onChangeSize={handleSizeChange}
            onChangePage={handlePageChange}/>
        </CardContent>
      </Card>
    </div>
  )
})

export default ActivityLogsPage
