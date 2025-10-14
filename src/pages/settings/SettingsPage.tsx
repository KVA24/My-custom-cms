import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const SettingsPage = () => {
  const {t} = useTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("nav.settings")}</h1>
        <p className="text-gray-600">Configure your application settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>This is a placeholder for the settings page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
