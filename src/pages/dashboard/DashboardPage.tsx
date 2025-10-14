import {useTranslation} from "react-i18next"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Package, ShoppingCart, TrendingUp, Users} from "lucide-react"
import React, {Fragment, useEffect} from "react";
import dashboardStore, {DashboardTabs} from "@/pages/dashboard/dashboardStore.ts";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.tsx";
import DateRangePicker from "@/components/ui/dateRangePicker.tsx";
import ChartLine from "@/components/common/ChartLine.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {observer} from "mobx-react-lite";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import {formatNumber} from "@/lib/utils.ts";
import {format} from "date-fns";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx';

const DashboardPage = observer(() => {
  const {t} = useTranslation()
  
  useEffect(() => {
    dashboardStore.callStatisticWithType().then()
  }, [dashboardStore.gte, dashboardStore.lte, dashboardStore.type]);
  
  useEffect(() => {
    dashboardStore.callAllStatistics().then()
  }, [dashboardStore.gte, dashboardStore.lte]);
  
  useEffect(() => {
    dashboardStore.callStatisticReward().then()
  }, [dashboardStore.gte, dashboardStore.lte]);
  
  useEffect(() => {
    dashboardStore.callStatisticPurchase().then()
  }, [dashboardStore.gte, dashboardStore.lte]);
  
  const flattenRewardData = (data: any) => {
    if (!Array.isArray(data)) return [];
    
    const sorted = [...data].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const result: any = sorted.flatMap(day =>
      day.data.map(item => ({
        date: day.date,
        rewardName: item.rewardName,
        totalUser: item.totalUser,
        totalQuantity: item.totalQuantity,
        totalValue: item.totalValue,
      }))
    );
    
    return result;
  }
  
  const flattenStoreData = (data: any) => {
    if (!Array.isArray(data)) return [];
    
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const result: any = sorted.flatMap(day =>
      day.data.map(item => ({
        date: day.date,
        storeItemId: item.storeItemId,
        storeItemName: item.storeItemName,
        totalMps: item.totalMps,
        totalSms: item.totalSms,
        totalUssd: item.totalUssd,
        totalGame: item.totalGame,
        totalRegister: item.totalRegister,
        totalRenew: item.totalRenew,
        totalUnsub: item.totalUnsub,
        totalCharge: item.totalCharge,
        totalRegisterRevenue: item.totalRegisterRevenue,
        totalRenewRevenue: item.totalRenewRevenue,
        totalChargeRevenue: item.totalChargeRevenue,
        totalRevenue: item.totalRevenue,
      }))
    );
    
    return result;
  }
  
  const stats = [
    {
      title: t("dashboard.totalUsers"),
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t("nav.products"),
      value: "1,234",
      change: "+5%",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t("dashboard.orders"),
      value: "856",
      change: "+18%",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t("dashboard.revenue"),
      value: "$45,678",
      change: "+23%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]
  
  const filterTab = (tab: string) => {
    dashboardStore.tabActive = tab as DashboardTabs
    if (tab === DashboardTabs.dashboard) {
    
    } else if (tab === DashboardTabs.reward) {
      dashboardStore.callStatisticReward().then()
    } else if (tab === DashboardTabs.purchase) {
      dashboardStore.callStatisticPurchase().then()
    }
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("nav.dashboard")}</h1>
          <CustomBreadcrumb
            items={[
              {label: 'Home', href: '/'},
              {label: 'Dashboard', isCurrent: true},
            ]}
          />
        </div>
      </div>
      
      {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">*/}
      {/*  {stats.map((stat, index) => {*/}
      {/*    const Icon = stat.icon*/}
      {/*    return (*/}
      {/*      <Card key={index}>*/}
      {/*        <CardHeader className="flex flex-row items-center justify-between gap-0 pb-2">*/}
      {/*          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>*/}
      {/*          <div className={`p-2 rounded-full ${stat.bgColor}`}>*/}
      {/*            <Icon className={`h-4 w-4 ${stat.color}`}/>*/}
      {/*          </div>*/}
      {/*        </CardHeader>*/}
      {/*        <CardContent>*/}
      {/*          <div className="text-2xl font-bold">{stat.value}</div>*/}
      {/*          <p className="text-xs text-muted-foreground">*/}
      {/*            <span className="text-green-600">{stat.change}</span> {t("dashboard.fromLastMonth")}*/}
      {/*          </p>*/}
      {/*        </CardContent>*/}
      {/*      </Card>*/}
      {/*    )*/}
      {/*  })}*/}
      {/*</div>*/}
      
      <Card>
        <Tabs defaultValue={dashboardStore.tabActive}
              onValueChange={(value) => filterTab(value)}>
          <TabsList className="justify-between px-5" variant="line">
            <div className="flex items-center gap-5">
              <TabsTrigger value={DashboardTabs.dashboard}>Dashboard</TabsTrigger>
              <TabsTrigger value={DashboardTabs.reward}>Reward</TabsTrigger>
              <TabsTrigger value={DashboardTabs.purchase}>Purchase</TabsTrigger>
            </div>
          </TabsList>
          <CardHeader className="flex items-center justify-end">
            {dashboardStore.tabActive === DashboardTabs.dashboard &&
              <div className="flex w-1/4">
                <Select
                  name="type"
                  value={dashboardStore.type || ""}
                  onValueChange={(value) =>
                    dashboardStore.type = value
                  }>
                  <SelectTrigger clearable={false} className="w-full">
                    <SelectValue placeholder="Choose Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"DAILY"}>Daily</SelectItem>
                    <SelectItem value={"MONTHLY"}>Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            <div className="w-1/4">
              <DateRangePicker
                start={dashboardStore.gte}
                end={dashboardStore.lte}
                onApply={(range) => {
                  dashboardStore.gte = range?.from ?? new Date()
                  dashboardStore.lte = range?.to ?? new Date()
                }}
              />
            </div>
          </CardHeader>
          <TabsContent value={DashboardTabs.dashboard}>
            <CardContent>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-2">
                <div className="w-full flex items-center justify-center p-4">
                  {dashboardStore.loading.activePlayers ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["activePlayers"]} type="activePlayers"
                               title={"Active Player"}/>
                  }
                </div>
                <div className="w-full flex items-center justify-center p-4">
                  {dashboardStore.loading.paidPlayers ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["paidPlayers"]} type="paidPlayers"
                               title={"Paid Player"}/>
                  }
                </div>
                <div className="w-full flex items-center justify-center p-4">
                  {dashboardStore.loading.dailyActiveUsers ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["dailyActiveUsers"]} type="dailyActiveUsers"
                               title={"Daily Active Users"}/>
                  }
                </div>
                <div className="flex items-center justify-center p-4">
                  {dashboardStore.loading.revenue ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["revenue"]} type="revenue" title={"Revenue"}/>
                  }
                </div>
                <div className="w-full flex items-center justify-center p-4">
                  {dashboardStore.loading.energyAdded ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["energyAdded"]} type="energyAdded"
                               title={"Energy Added"}/>
                  }
                </div>
                <div className="flex items-center justify-center p-4">
                  {dashboardStore.loading.energyConsumption ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["energyConsumption"]} type="energyConsumption"
                               title={"Energy Consumed"}/>
                  }
                </div>
                <div className="flex items-center justify-center p-4">
                  {dashboardStore.loading.rewardedPrizes ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["rewardedPrizes"]} type="rewardedPrizes"
                               title={"Rewarded Prizes"}/>
                  }
                </div>
                <div className="flex items-center justify-center p-4">
                  {dashboardStore.loading.rewardedPrizes ?
                    <LoadingSpinner size={"md"}/>
                    :
                    <ChartLine data={dashboardStore.statistics["rewardedPrizes"]} type="rewardedPrizes_value"
                               title={"Rewarded Prizes Value"}/>
                  }
                </div>
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value={DashboardTabs.reward}>
            <CardContent>
              <div className="flex items-center justify-center p-4">
                {dashboardStore.loading.rewardStatistic ?
                  <LoadingSpinner size={"md"}/>
                  :
                  <ChartLine data={dashboardStore.statistics["rewardStatistic"]} type="rewardStatistic"
                             title={"Rewarded Statistic"}/>
                }
              </div>
              <div className="p-6">
                <h1 className="text-xl font-semibold">Reward Statistic</h1>
                {dashboardStore.loading.rewardStatistic ?
                  <div className="w-full flex justify-center">
                    <LoadingSpinner size={"md"}/>
                  </div>
                  :
                  <Fragment>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                        <tr>
                          <th>Date</th>
                          <th>Reward Name</th>
                          <th>Total User</th>
                          <th>Total Value</th>
                          <th>Total Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(flattenRewardData(dashboardStore.statistics['rewardStatistic']) || []).map((item, index, arr) => {
                          const showDate = index === 0 || item.date !== arr[index - 1].date;
                          return (
                            <tr
                              key={index}
                              className=""
                            >
                              <td>
                                {showDate ? format(item.date, "dd/MM/yyyy") : ""}
                              </td>
                              <td>
                                {item.rewardName}
                              </td>
                              <td>
                                {formatNumber(item.totalUser)}
                              </td>
                              <td>
                                {formatNumber(item.totalValue)}
                              </td>
                              <td>
                                {formatNumber(item.totalQuantity)}
                              </td>
                            </tr>
                          )
                        })}
                        </tbody>
                      </table>
                    </div>
                    
                    {
                      dashboardStore.statistics['rewardStatistic']?.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No data available
                        </div>
                      )
                    }
                  </Fragment>
                }
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value={DashboardTabs.purchase}>
            <CardContent>
              <div className="flex items-center justify-center p-4">
                {dashboardStore.loading.purchaseStatistic ?
                  <LoadingSpinner size={"md"}/>
                  :
                  <ChartLine data={dashboardStore.statistics["purchaseStatistic"]} type="purchaseStatistic"
                             title={"Purchase Statistic"}/>
                }
              </div>
              <div className="p-6">
                <h1 className="text-xl font-semibold">Purchases Statistic</h1>
                {dashboardStore.loading.purchaseStatistic ?
                  <div className="w-full flex justify-center">
                    <LoadingSpinner size={"md"}/>
                  </div>
                  :
                  <Fragment>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                        <tr>
                          <th>Date</th>
                          <th>Item Name</th>
                          <th>Charge</th>
                          <th>Charge Revenue</th>
                          <th>Game</th>
                          <th>Mps</th>
                          <th>Register</th>
                          <th>Register Revenue</th>
                          <th>Renew</th>
                          <th>Renew Revenue</th>
                          <th>Sms</th>
                          <th>Unsub</th>
                          <th>Ussd</th>
                          <th>Total Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(flattenStoreData(dashboardStore.statistics['purchaseStatistic']) || []).map((item, index, arr) => {
                          const showDate = index === 0 || item.date !== arr[index - 1].date;
                          return (
                            <tr
                              key={index}
                              className=""
                            >
                              <td>
                                {showDate ? format(item.date, "dd/MM/yyyy") : ""}
                              </td>
                              <td>
                                {item.storeItemName}
                              </td>
                              <td>
                                {formatNumber(item.totalCharge)}
                              </td>
                              <td>
                                {formatNumber(item.totalChargeRevenue)}
                              </td>
                              <td>
                                {formatNumber(item.totalGame)}
                              </td>
                              <td>
                                {formatNumber(item.totalMps)}
                              </td>
                              <td>
                                {formatNumber(item.totalRegister)}
                              </td>
                              <td>
                                {formatNumber(item.totalRegisterRevenue)}
                              </td>
                              <td>
                                {formatNumber(item.totalRenew)}
                              </td>
                              <td>
                                {formatNumber(item.totalRenewRevenue)}
                              </td>
                              <td>
                                {formatNumber(item.totalSms)}
                              </td>
                              <td>
                                {formatNumber(item.totalUnsub)}
                              </td>
                              <td>
                                {formatNumber(item.totalUssd)}
                              </td>
                              <td>
                                {formatNumber(item.totalRevenue)}
                              </td>
                            </tr>
                          )
                        })}
                        </tbody>
                      </table>
                    </div>
                    
                    {
                      dashboardStore.statistics['purchaseStatistic']?.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No data available
                        </div>
                      )
                    }
                  </Fragment>
                }
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      
      {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">*/}
      {/*  <Card>*/}
      {/*    <CardHeader>*/}
      {/*      <CardTitle>{t("dashboard.quickActions")}</CardTitle>*/}
      {/*      <CardDescription>Common tasks and shortcuts</CardDescription>*/}
      {/*    </CardHeader>*/}
      {/*    <CardContent>*/}
      {/*      <div className="grid grid-cols-2 gap-4">*/}
      {/*        <button*/}
      {/*          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">*/}
      {/*          <Users className="h-6 w-6 text-blue-600 mb-2"/>*/}
      {/*          <p className="font-medium">{t("dashboard.addUser")}</p>*/}
      {/*          <p className="text-xs text-gray-500">{t("dashboard.createNewUser")}</p>*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">*/}
      {/*          <Package className="h-6 w-6 text-green-600 mb-2"/>*/}
      {/*          <p className="font-medium">{t("dashboard.addProduct")}</p>*/}
      {/*          <p className="text-xs text-gray-500">{t("dashboard.createNewProduct")}</p>*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </CardContent>*/}
      {/*  </Card>*/}
      {/*</div>*/}
    </div>
  )
})

export default DashboardPage
