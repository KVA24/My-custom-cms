import React, {useMemo} from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import dashboardStore, {DataPoint} from "@/pages/dashboard/dashboardStore.ts";

interface Props {
  type?: string
  title?: string
  data?: DataPoint[] | null
}

const LineChart: React.FC<Props> = ({
                                      type,
                                      title = "Chart Line Example",
                                      data = null
                                    }) => {
  const series = type === "dailyActiveUsers" ?
    useMemo(() => {
      return [
        {
          name: "Active Users",
          data: data?.map((d) => d.totalActiveUser),
          type: "line" as const,
        },
      ]
    }, [data])
    : type === "activePlayers" ?
      useMemo(() => {
        return [
          {
            name: "Active Players",
            data: data?.map((d) => d.totalActivePlayer),
            type: "line" as const,
          },
        ]
      }, [data])
      : type === "paidPlayers" ?
        useMemo(() => {
          return [
            {
              name: "Paid Players",
              data: data?.map((d) => d.totalPaidPlayer),
              type: "line" as const,
            },
          ]
        }, [data])
        :
        useMemo(() => {
          let names: any = []
          switch (type) {
            case "revenue":
              names = Array.from(new Set(data?.flatMap((d) => d.data.map((item) => item.storeItemName))));
              break;
            case "rewardStatistic":
              names = Array.from(new Set(data?.flatMap((d) => d.data.map((item) => item.rewardName))));
              break;
            case "purchaseStatistic":
              names = Array.from(new Set(data?.flatMap((d) => d.data.map((item) => item.storeItemName))));
              break;
            default:
              names = Array.from(new Set(data?.flatMap((d) => d.data.map((item) => item.title))));
          }
          
          if (type === "revenue") {
            return names.map((name) => ({
              name,
              data: data?.map((d) => {
                const found = d.data.find((item) => item.storeItemName === name)
                return found ? found.totalRevenue : null
              }),
              type: "line" as const,
            }))
          } else if (type === "rewardedPrizes") {
            return names.map((name) => ({
              name,
              data: data?.map((d) => {
                const found = d.data.find((item) => item.title === name)
                return found ? found.totalRewardedQuantity : null
              }),
              type: "line" as const,
            }))
          } else if (type === "rewardedPrizes_value") {
            return names.map((name) => ({
              name,
              data: data?.map((d) => {
                const found = d.data.find((item) => item.title === name)
                return found ? found.totalRewardedValue : null
              }),
              type: "line" as const,
            }))
          } else if (type === "rewardStatistic") {
            return names.map((name) => ({
              name,
              data: data?.map((d) => {
                const found = d.data.find((item) => item.rewardName === name)
                return found ? found.totalQuantity : null
              }),
              type: "line" as const,
            }))
          } else if (type === "purchaseStatistic") {
            return names.map((name) => ({
              name,
              data: data?.map((d) => {
                const found = d.data.find((item) => item.storeItemName === name)
                return found ? found.totalRevenue : null
              }),
              type: "line" as const,
            }))
          } else {
            return names.map((name) => ({
              name,
              data: data?.map((d) => {
                const found = d.data.find((item) => item.title === name)
                return found ? found.total : null
              }),
              type: "line" as const,
            }))
          }
        }, [data])
  
  const getNameYAxis = (type: string) => {
    switch (type) {
      case "rewardStatistic":
        return "Total Quantity"
      case "purchaseStatistic":
        return "Total Revenue"
      default:
        return "Value"
    }
  }
  
  
  const options: Highcharts.Options = {
    title: {
      text: title ? title : "Chart Line Example",
      align: "left",
    },
    xAxis: {
      categories: dashboardStore.type === "DAILY" ? data?.map((d) => d.date) : data?.map((d) => `${d.month}/${d.year}`),
      title: {text: dashboardStore.type === "DAILY" ? "Date" : "Month"},
    },
    yAxis: {
      title: {text: getNameYAxis(type ?? "")},
    },
    tooltip: {
      shared: true,
      valueSuffix: "",
    },
    series,
  }
  
  return <HighchartsReact
    highcharts={Highcharts}
    options={options}
    containerProps={{className: "w-full"}}
  />
}

export default LineChart
