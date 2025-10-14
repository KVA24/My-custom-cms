"use client"

import React, {Fragment, useEffect} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import leaderboardStore from "./leaderboardStore.ts";
import {observer} from "mobx-react-lite";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import {addWeeks, endOfWeek, endOfYear, format, isBefore, isWithinInterval, startOfWeek, startOfYear} from "date-fns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {numberFormat} from "@/lib/utils.ts";
import {FileDown, Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import SimplePagination from "@/components/common/SimplePagination.tsx";
import {Button} from "@/components/ui/button.tsx";

const LeaderboardPage = observer(() => {
  const {t} = useTranslation()
  
  function getThreeYears() {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }
  
  function getWeeksOfYear(year: number) {
    const weeks: { week: number; start: Date; end: Date }[] = [];
    
    let start = startOfWeek(startOfYear(new Date(year, 0, 1)), {weekStartsOn: 1});
    const lastDay = endOfYear(new Date(year, 11, 31));
    let weekNum = 1;
    
    while (isBefore(start, lastDay) || start.getTime() === lastDay.getTime()) {
      const end = endOfWeek(start, {weekStartsOn: 1});
      
      weeks.push({
        week: weekNum,
        start,
        end,
      });
      
      start = addWeeks(start, 1);
      weekNum++;
    }
    
    return weeks;
  }
  
  function getCurrentWeekOfYear(year: number) {
    const today = new Date();
    const weeks = getWeeksOfYear(year);
    
    return weeks.find(w =>
      isWithinInterval(today, {start: w.start, end: w.end})
    );
  }
  
  useEffect(() => {
    leaderboardStore.clearState()
    leaderboardStore.listYear = getThreeYears()
    leaderboardStore.listWeek = getWeeksOfYear(leaderboardStore.year)
    leaderboardStore.weekId = getCurrentWeekOfYear(leaderboardStore.year)?.week
  }, []);
  
  useEffect(() => {
    // if (!leaderboardStore.searchKey) {
    //   leaderboardStore.getList().then()
    //   return;
    // }
    
    const handler = setTimeout(() => {
      leaderboardStore.getList().then()
    }, 500);
    
    return () => clearTimeout(handler);
  }, [leaderboardStore.searchKey, leaderboardStore.year, leaderboardStore.weekId, leaderboardStore.page, leaderboardStore.size]);
  
  const handlePageChange = (action: string) => {
    if (action === 'next') {
      leaderboardStore.previous = undefined
      leaderboardStore.next = leaderboardStore.metadata?.next
      leaderboardStore.getList().then()
    } else if (action === 'prev') {
      leaderboardStore.previous = leaderboardStore.metadata?.pre
      leaderboardStore.next = undefined
      leaderboardStore.getList().then()
    }
  }
  
  const handleSizeChange = (size: number) => {
    leaderboardStore.size = size
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Leaderboard', isCurrent: true},
            ]}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard list</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                autoComplete="off"
                placeholder={t("common.search")}
                value={leaderboardStore.searchKey}
                onChange={(e) => leaderboardStore.searchKey = e.target.value}
                className="pl-10"
              />
            </div>
            <div className="flex w-full">
              <Select
                name="role"
                value={leaderboardStore.year || ""}
                onValueChange={(value: string) => {
                  leaderboardStore.year = Number(value)
                  leaderboardStore.listWeek = getWeeksOfYear(leaderboardStore.year)
                  leaderboardStore.weekId = leaderboardStore.listWeek[0].week
                }}>
                <SelectTrigger className="w-full" clearable={false}>
                  <SelectValue placeholder="Choose Year"/>
                </SelectTrigger>
                <SelectContent>
                  {leaderboardStore.listYear?.map((item, index) => (
                    <SelectItem key={index}
                                value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full">
              <Select
                name="role"
                value={leaderboardStore.weekId || ""}
                onValueChange={(value) =>
                  leaderboardStore.weekId = value
                }>
                <SelectTrigger className="w-full" clearable={false}>
                  <SelectValue placeholder="Choose Week"/>
                </SelectTrigger>
                <SelectContent>
                  {leaderboardStore.listWeek?.map((item, index) => (
                    <SelectItem key={index}
                                value={item.week}>Week {item.week}({format(item.start, "dd/MM/yyyy")} - {format(item.end, "dd/MM/yyyy")})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="primary" loading={leaderboardStore.isLoadingBt}
                      onClick={() => leaderboardStore.exportData()}>
                <FileDown/> Export Data
              </Button>
            </div>
          </div>
          {leaderboardStore.isLoading ?
            <div className="w-full flex justify-center">
              <LoadingSpinner size={"md"}/>
            </div>
            :
            <Fragment>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Total Jackfruits</th>
                    <th>Total Sessions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {(leaderboardStore.dataLeaderboard || []).map((item, index) => (
                    <tr
                      key={index}
                      className=""
                    >
                      <td>
                        {item.rank}
                      </td>
                      <td>
                        {item.username}
                      </td>
                      <td>
                        {numberFormat(item.totalJackfruits)}
                      </td>
                      <td>
                        {numberFormat(item.totalSessions)}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              
              {
                leaderboardStore.dataLeaderboard?.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {leaderboardStore.searchKey ? "No results found" : "No data available"}
                  </div>
                )
              }
            </Fragment>
          }
          <SimplePagination
            disabledNext={!leaderboardStore.metadata?.hasNextPage}
            disabledPre={!leaderboardStore.metadata?.hasPrePage}
            currentSize={leaderboardStore.size}
            onChangeSize={handleSizeChange}
            onChangePage={handlePageChange}/>
        </CardContent>
      </Card>
    
    </div>
  )
})

export default LeaderboardPage
