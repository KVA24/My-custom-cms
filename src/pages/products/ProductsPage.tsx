"use client"

import {useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Edit, Eye, Plus, Search, Star, Trash2} from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  rating: number
  image: string
  status: "active" | "inactive"
}

const ProductsPage = () => {
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  
  const products: Product[] = [
    {
      id: "1",
      name: "Wireless Headphones",
      category: "Electronics",
      price: 99.99,
      stock: 45,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
      status: "active",
    },
    {
      id: "2",
      name: "Smart Watch",
      category: "Electronics",
      price: 299.99,
      stock: 23,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
      status: "active",
    },
    {
      id: "3",
      name: "Coffee Mug",
      category: "Home & Garden",
      price: 15.99,
      stock: 0,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=80&h=80&fit=crop",
      status: "inactive",
    },
  ]
  
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("nav.products")}</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4"/>
          <span>Add Product</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input
                  autoComplete="off"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">{t("common.filter")}</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                              <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">${product.price}</p>
                            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">5</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
