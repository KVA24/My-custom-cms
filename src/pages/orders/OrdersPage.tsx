import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const OrdersPage = () => {
  const {t} = useTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("nav.orders")}</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Orders</CardTitle>
          <CardDescription>This is a placeholder for the orders page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Orders management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrdersPage
