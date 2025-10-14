"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx"
import userStore, {UserTabs} from "../userStore.ts";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx';
import {CalendarDays, Search, Undo} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import BadgeRender from "@/components/common/BadgeRender.tsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {dateTimeFormat, numberFormat} from "@/lib/utils.ts";
import SimplePagination from "@/components/common/SimplePagination.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover.tsx';
import {Calendar} from "@/components/ui/calendar.tsx";
import {DateRange} from "react-day-picker";
import {addDays, format} from "date-fns";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";

const UsersDetailPage = observer(() => {
  const {t} = useTranslation()
  const {id} = useParams<{ id: string }>()
  
  useEffect(() => {
    userStore.clearState()
    userStore.getItemList().then()
    userStore.getDetail(id).then()
  }, []);
  
  useEffect(() => {
    if (!userStore.searchId) {
      userStore.getTransaction(id).then()
      return;
    }
    
    const handler = setTimeout(() => {
      userStore.getTransaction(id).then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [userStore.searchId, userStore.size, userStore.typeTransaction, userStore.searchItem, userStore.action, userStore.gte, userStore.lte]);
  
  const filterTab = (tab: string) => {
    userStore.tabActive = tab as UserTabs
    if (tab === UserTabs.transaction) {
      userStore.getTransaction(id).then()
    } else if (tab === UserTabs.ranking) {
    
    }
  }
  
  const handlePageChange = (action: string) => {
    if (action === 'next') {
      userStore.previous = undefined
      userStore.next = userStore.metadata?.next
      userStore.getTransaction(id).then()
    } else if (action === 'prev') {
      userStore.previous = userStore.metadata?.pre
      userStore.next = undefined
      userStore.getTransaction(id).then()
    }
  }
  
  const handleSizeChange = (size: number) => {
    userStore.size = size
  }
  
  const getBalanceByCode = (code: string): number | null => {
    const found = userStore.dataUser?.userWallets?.find(entry => entry.item.code === code)
    return found ? found.balance : null
  }
  
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });
  
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    date,
  );
  
  const handleDateRangeApply = () => {
    setDate(tempDateRange);
    setIsOpen(false);
    userStore.gte = tempDateRange?.from
    userStore.lte = tempDateRange?.to
  };
  
  const handleDateRangeReset = () => {
    setTempDateRange(undefined);
  };
  
  const defaultStartDate = new Date();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("users.userDetail")}</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Users', href: '/cms/users'},
              {label: `User ${userStore.dataUser?.username} detail`, isCurrent: true},
            ]}
          />
        </div>
      
      </div>
      
      <Card>
        <CardHeader>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 px-2 py-4">
            <span className="text-sm">Username: <strong>{userStore.dataUser?.username}</strong></span>
            <span className="text-sm">Status: <BadgeRender status={userStore.dataUser?.state}/></span>
            <span className="text-sm">Diamond: <strong>{getBalanceByCode('DIAMOND')}</strong></span>
            <span className="text-sm">Turn Free: <strong>{getBalanceByCode('TURN_FREE')}</strong></span>
            <span className="text-sm">Turn Paid: <strong>{getBalanceByCode('TURN_PAID')}</strong></span>
            <span className="text-sm">Mix: <strong>{getBalanceByCode('MIX')}</strong></span>
            <span className="text-sm">Hammer: <strong>{getBalanceByCode('HAMMER')}</strong></span>
          </div>
        </CardHeader>
        <Tabs defaultValue={userStore.tabActive}
              onValueChange={(value) => filterTab(value)}>
          <TabsList className="justify-between px-5 mb-2.5" variant="line">
            <div className="flex items-center gap-5">
              <TabsTrigger value={UserTabs.transaction}>Transaction</TabsTrigger>
              <TabsTrigger value={UserTabs.ranking}>Ranking</TabsTrigger>
            </div>
          </TabsList>
          
          <TabsContent value={UserTabs.transaction}>
            <CardContent>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input
                    autoComplete="off"
                    placeholder={t("common.searchId")}
                    value={userStore.searchId}
                    onChange={(e) => userStore.searchId = e.target.value}
                    className="pl-10"
                  />
                </div>
                <div className="flex w-full">
                  <Select
                    name="role"
                    value={userStore.searchItem || ""}
                    onValueChange={(value) =>
                      userStore.searchItem = value
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Item"/>
                    </SelectTrigger>
                    <SelectContent>
                      {userStore.itemList?.map((item, index) => (
                        <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full">
                  <Select
                    name="role"
                    value={userStore.typeTransaction || ""}
                    onValueChange={(value) =>
                      userStore.typeTransaction = value
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Source Type"/>
                    </SelectTrigger>
                    <SelectContent>
                      {userStore.typeTransactionList?.map((item, index) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full">
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <Button id="date" variant="outline" className="w-full">
                        <CalendarDays size={16} className="me-0.5"/>
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, 'dd/MM/yyyy')} -{' '}
                              {format(date.to, 'dd/MM/yyyy')}
                            </>
                          ) : (
                            format(date.from, 'dd/MM/yyyy')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={tempDateRange?.from || defaultStartDate}
                        selected={tempDateRange}
                        onSelect={setTempDateRange}
                        numberOfMonths={2}
                      />
                      <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                        <Button variant="outline" onClick={handleDateRangeReset}>
                          Reset
                        </Button>
                        <Button onClick={handleDateRangeApply}>Apply</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex w-full">
                  <Select
                    name="role"
                    value={userStore.action || ""}
                    onValueChange={(value) =>
                      userStore.action = value
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Action"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"ADD"}>ADD</SelectItem>
                      <SelectItem value={"SUBTR"}>SUBTR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full justify-start items-center gap-2">
                  <Button variant={"warning"}
                          onClick={() => {
                            setDate(undefined)
                            userStore.clearState()
                            userStore.getTransaction(id).then()
                          }}
                  >
                    <Undo/> Reset
                  </Button>
                </div>
              </div>
              {userStore.isLoading ?
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
                        <th>Item</th>
                        <th>Source Type</th>
                        <th>Action</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Note</th>
                        <th>Time</th>
                      </tr>
                      </thead>
                      <tbody>
                      {(userStore.dataTransaction || []).map((item, index) => (
                        <tr
                          key={index}
                          className="">
                          <td>
                            {item.id}
                          </td>
                          <td>
                            {item.item?.name}
                          </td>
                          <td>
                            {item.sourceType}
                          </td>
                          <td>
                            {item.action}
                          </td>
                          <td>
                            {numberFormat(item.amount)}
                          </td>
                          <td>
                            {numberFormat(item.balance)}
                          </td>
                          <td>
                            {item.note}
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
                    userStore.dataTransaction?.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {userStore.searchKey ? "No results found" : "No data available"}
                      </div>
                    )
                  }
                </Fragment>
              }
              <SimplePagination
                disabledNext={!userStore.metadata?.hasNextPage}
                disabledPre={!userStore.metadata?.hasPrePage}
                currentSize={userStore.size}
                onChangeSize={handleSizeChange}
                onChangePage={handlePageChange}/>
            </CardContent>
          </TabsContent>
          <TabsContent value={UserTabs.ranking}>
            <CardContent>
            
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
})

export default UsersDetailPage
