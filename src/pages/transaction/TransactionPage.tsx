"use client"

import React, {Fragment, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent} from "@/components/ui/card.tsx"
import transactionStore, {TransactionTabs} from "./transactionStore.ts";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router";
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx';
import {CalendarDays, FileDown, Search, Undo} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
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

const TransactionPage = observer(() => {
  const {t} = useTranslation()
  const {id} = useParams<{ id: string }>()
  
  useEffect(() => {
    transactionStore.clearState()
  }, []);
  
  useEffect(() => {
    transactionStore.getStoreList().then()
    transactionStore.getRewardList().then()
    if (!transactionStore.searchId) {
      transactionStore.getTransaction().then()
      return;
    }
    
    const handler = setTimeout(() => {
      transactionStore.getTransaction().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [
    transactionStore.searchId,
    transactionStore.searchUsername,
    transactionStore.searchPackage,
    transactionStore.searchStore,
    transactionStore.searchReward,
    transactionStore.size,
    transactionStore.typeTransaction,
    transactionStore.searchType,
    transactionStore.searchPaymentMethod,
    transactionStore.searchChargeType,
    transactionStore.gte, transactionStore.lte
  ]);
  
  const filterTab = (tab: string) => {
    transactionStore.clearState()
    transactionStore.tabActive = tab as TransactionTabs
    transactionStore.getTransaction().then()
  }
  
  const handlePageChange = (action: string) => {
    if (action === 'next') {
      transactionStore.previous = undefined
      transactionStore.next = transactionStore.metadata?.next
      transactionStore.getTransaction().then()
    } else if (action === 'prev') {
      transactionStore.previous = transactionStore.metadata?.pre
      transactionStore.next = undefined
      transactionStore.getTransaction().then()
    }
  }
  
  const handleSizeChange = (size: number) => {
    transactionStore.size = size
  }
  
  const getBalanceByCode = (code: string): number | null => {
    const found = transactionStore.dataUser?.userWallets?.find(entry => entry.item.code === code)
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
    transactionStore.gte = tempDateRange?.from
    transactionStore.lte = tempDateRange?.to
  };
  
  const handleDateRangeReset = () => {
    setTempDateRange(undefined);
  };
  
  const defaultStartDate = new Date();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transaction</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Transaction', isCurrent: true},
            ]}
          />
        </div>
      
      </div>
      
      <Card>
        <Tabs defaultValue={transactionStore.tabActive}
              onValueChange={(value) => filterTab(value)}>
          <TabsList className="justify-between px-5 mb-2.5" variant="line">
            <div className="flex items-center gap-5">
              <TabsTrigger value={TransactionTabs.energy}>Energy</TabsTrigger>
              <TabsTrigger value={TransactionTabs.purchases}>Purchases</TabsTrigger>
              <TabsTrigger value={TransactionTabs.reward}>Reward</TabsTrigger>
            </div>
          </TabsList>
          {/*<TabsContent value={TransactionTabs.energy || TransactionTabs.purchases || TransactionTabs.reward}>*/}
          <CardContent>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input
                  autoComplete="off"
                  placeholder={t("common.searchId")}
                  value={transactionStore.searchId}
                  onChange={(e) => transactionStore.searchId = e.target.value}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input
                  autoComplete="off"
                  placeholder={"Search by username"}
                  value={transactionStore.searchUsername}
                  onChange={(e) => transactionStore.searchUsername = e.target.value}
                  className="pl-10"
                />
              </div>
              {transactionStore.tabActive === TransactionTabs.purchases && (
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input
                    autoComplete="off"
                    placeholder={"Search by package code"}
                    value={transactionStore.searchPackage}
                    onChange={(e) => transactionStore.searchPackage = e.target.value}
                    className="pl-10"
                  />
                </div>
              )}
              {transactionStore.tabActive === TransactionTabs.energy && (
                <div className="flex w-full">
                  <Select
                    name="role"
                    value={transactionStore.typeTransaction || ""}
                    onValueChange={(value) =>
                      transactionStore.typeTransaction = value
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Type"/>
                    </SelectTrigger>
                    <SelectContent>
                      {transactionStore.typeTransactionList?.map((item, index) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {transactionStore.tabActive === TransactionTabs.purchases && (
                <>
                  <div className="flex w-full">
                    <Select
                      name="role"
                      value={transactionStore.searchStore || ""}
                      onValueChange={(value) =>
                        transactionStore.searchStore = value
                      }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Store"/>
                      </SelectTrigger>
                      <SelectContent>
                        {transactionStore.storeList?.map((item, index) => (
                          <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-full">
                    <Select
                      name="role"
                      value={transactionStore.searchType || ""}
                      onValueChange={(value) =>
                        transactionStore.searchType = value
                      }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Type"/>
                      </SelectTrigger>
                      <SelectContent>
                        {transactionStore.typeList?.map((item, index) => (
                          <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-full">
                    <Select
                      name="role"
                      value={transactionStore.searchPaymentMethod || ""}
                      onValueChange={(value) =>
                        transactionStore.searchPaymentMethod = value
                      }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Payment Method"/>
                      </SelectTrigger>
                      <SelectContent>
                        {transactionStore.paymentMethodList?.map((item, index) => (
                          <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-full">
                    <Select
                      name="role"
                      value={transactionStore.searchChargeType || ""}
                      onValueChange={(value) =>
                        transactionStore.searchChargeType = value
                      }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Charge Type"/>
                      </SelectTrigger>
                      <SelectContent>
                        {transactionStore.chargeTypeList?.map((item, index) => (
                          <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {transactionStore.tabActive === TransactionTabs.reward && (
                <div className="flex w-full">
                  <Select
                    name="role"
                    value={transactionStore.searchReward || ""}
                    onValueChange={(value) =>
                      transactionStore.searchReward = value
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Reward"/>
                    </SelectTrigger>
                    <SelectContent>
                      {transactionStore.rewardList?.map((item, index) => (
                        <SelectItem key={index} value={item.id}>{item.rewardName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
              <div className="flex w-full justify-start items-center gap-2">
                <Button variant={"warning"}
                        onClick={() => {
                          setDate(undefined)
                          transactionStore.clearState()
                          transactionStore.getTransaction().then()
                        }}
                >
                  <Undo/> Reset
                </Button>
                <Button variant={"primary"}
                        loading={transactionStore.isLoadingBt}
                        onClick={() => {
                          transactionStore.exportData().then()
                        }}
                >
                  <FileDown/> Export Excel
                </Button>
              </div>
            </div>
            {
              transactionStore.isLoading ?
                <div className="w-full flex justify-center">
                  <LoadingSpinner size={"md"}/>
                </div>
                :
                <Fragment>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr>
                        <th>Id Transaction</th>
                        <th>User</th>
                        {transactionStore.tabActive === TransactionTabs.energy && (
                          <>
                            <th>Source Type</th>
                            <th>Turn Type</th>
                            <th>Action</th>
                          </>
                        )}
                        {transactionStore.tabActive === TransactionTabs.purchases && (
                          <>
                            <th>Package Code</th>
                            {/*<th>Item</th>*/}
                            <th>Item Store</th>
                            <th>Price</th>
                            <th>Type</th>
                            <th>Charge Type</th>
                            <th>Payment Method</th>
                            <th>State</th>
                          </>
                        )}
                        {transactionStore.tabActive === TransactionTabs.reward && (
                          <>
                            <th>Reward Name</th>
                            <th>State</th>
                          
                          </>
                        )}
                        
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Time</th>
                      </tr>
                      </thead>
                      <tbody>
                      {(transactionStore.dataTransaction || []).map((item, index) => (
                        <tr
                          key={index}
                          className="">
                          <td>
                            {item.transId}
                          </td>
                          <td>
                            {item.username}
                          </td>
                          {transactionStore.tabActive === TransactionTabs.energy && (
                            <>
                              <td>
                                {item.sourceType}
                              </td>
                              <td>
                                {item.turnType}
                              </td>
                              <td>
                                {item.action}
                              </td>
                            </>
                          )}
                          {transactionStore.tabActive === TransactionTabs.purchases && (
                            <>
                              <td>
                                {item.packageCode}
                              </td>
                              {/*<td>*/}
                              {/*  {item.itemName}*/}
                              {/*</td>*/}
                              <td>
                                {item.storeItemName}
                              </td>
                              <td>
                                {numberFormat(item.price)}
                              </td>
                              <td>
                                {item.type}
                              </td>
                              <td>
                                {item.chargeType}
                              </td>
                              <td>
                                {item.paymentMethod}
                              </td>
                              <td>
                                {item.state}
                              </td>
                            </>
                          )}
                          {transactionStore.tabActive === TransactionTabs.reward && (
                            <>
                              <td>
                                {item.rewardName}
                              </td>
                              <td>
                                {item.state}
                              </td>
                            </>
                          )}
                          
                          <td>
                            {numberFormat(item.amount)}
                          </td>
                          <td>
                            {numberFormat(item.balance)}
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
                    transactionStore.dataTransaction?.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No data available
                      </div>
                    )
                  }
                </Fragment>
            }
            <SimplePagination
              disabledNext={!transactionStore.metadata?.hasNextPage}
              disabledPre={!transactionStore.metadata?.hasPrePage}
              currentSize={transactionStore.size}
              onChangeSize={handleSizeChange}
              onChangePage={handlePageChange}/>
          </CardContent>
          {/*</TabsContent>*/
          }
        </Tabs>
      </Card>
    </div>
  )
})

export default TransactionPage
