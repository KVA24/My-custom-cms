import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const ReportsPage = () => {
  const {t} = useTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and view reports</p>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Reports</CardTitle>
          <CardDescription>This is a placeholder for the reports page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Reports functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsPage
