import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Edit, Plus, Tag, Trash2} from "lucide-react"

const CategoriesPage = () => {
  const {t} = useTranslation()
  
  const categories = [
    {id: "1", name: "Electronics", productCount: 156, description: "Electronic devices and gadgets"},
    {id: "2", name: "Clothing", productCount: 89, description: "Fashion and apparel items"},
    {id: "3", name: "Home & Garden", productCount: 234, description: "Home improvement and garden supplies"},
    {id: "4", name: "Sports", productCount: 67, description: "Sports equipment and accessories"},
  ]
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4"/>
          <span>Add Category</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5"/>
                <span>{category.name}</span>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{category.productCount}</p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4"/>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage
