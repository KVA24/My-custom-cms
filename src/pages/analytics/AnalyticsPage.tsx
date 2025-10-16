import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const AnalyticsPage = () => {
  const {t} = useTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("nav.analytics")}</h1>
        <p className="text-gray-600">View your business analytics</p>
      </div>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Analytics Overview</CardTitle>
          <CardDescription>This is a placeholder for the analytics page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Analytics and reporting functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPage
