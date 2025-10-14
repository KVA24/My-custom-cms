import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const SubCategoriesPage = () => {
  const {t} = useTranslation()
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sub Categories</h1>
        <p className="text-gray-600">Manage product sub-categories</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sub Categories</CardTitle>
          <CardDescription>This is a placeholder for the sub-categories page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Sub-categories functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubCategoriesPage
