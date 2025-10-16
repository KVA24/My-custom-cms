import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const InventoryPage = () => {
  const {t} = useTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-600">Track and manage your inventory</p>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Inventory Management</CardTitle>
          <CardDescription>This is a placeholder for the inventory page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Inventory management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryPage
