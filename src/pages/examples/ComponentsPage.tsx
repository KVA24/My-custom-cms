"use client"

import {useState} from "react"
import {useTranslation} from "react-i18next"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {Checkbox} from "@/components/ui/checkbox"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {type Column, DataTable} from "@/components/ui/DataTable"
import {type GalleryImage, ImageGallery} from "@/components/ui/ImageGallery"
import {Download, Eye, Heart, Star} from "lucide-react"
import {Label} from "@/components/ui/label.tsx";

interface SampleUser {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

const ComponentsPage = () => {
  const {t} = useTranslation()
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    country: "",
    newsletter: false,
    plan: "",
  })
  
  // Sample data for table
  const sampleUsers: SampleUser[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "active",
      joinDate: "2024-01-10",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Moderator",
      status: "inactive",
      joinDate: "2024-01-05",
    },
  ]
  
  // Table columns
  const userColumns: Column<SampleUser>[] = [
    {
      key: "name",
      label: t("common.name"),
      sortable: true,
    },
    {
      key: "email",
      label: t("common.email"),
      sortable: true,
    },
    {
      key: "role",
      label: t("common.role"),
      render: (value) => (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: t("common.status"),
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {t(`common.${value}`)}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: t("users.joinDate"),
      sortable: true,
    },
  ]
  
  // Sample images for gallery
  const galleryImages: GalleryImage[] = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      alt: t("gallery.mountainVista"),
      title: t("gallery.mountainVista"),
      description: t("gallery.mountainDescription"),
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      alt: t("gallery.oceanWaves"),
      title: t("gallery.oceanWaves"),
      description: t("gallery.oceanDescription"),
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      alt: t("gallery.forestTrail"),
      title: t("gallery.forestTrail"),
      description: t("gallery.forestDescription"),
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      alt: t("gallery.cityLights"),
      title: t("gallery.cityLights"),
      description: t("gallery.cityDescription"),
    },
  ]
  
  // Options for select and radio
  const countryOptions: any[] = [
    {value: "us", label: t("form.unitedStates")},
    {value: "uk", label: t("form.unitedKingdom")},
    {value: "ca", label: t("form.canada")},
    {value: "au", label: t("form.australia")},
    {value: "vn", label: t("form.vietnam")},
  ]
  
  const planOptions: any[] = [
    {value: "basic", label: t("form.basicPlan")},
    {value: "pro", label: t("form.proPlan")},
    {value: "enterprise", label: t("form.enterprisePlan")},
  ]
  
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({...prev, [field]: value}))
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("components.title")}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t("components.subtitle")}</p>
      </div>
      
      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>{t("components.formComponents")}</CardTitle>
          <CardDescription>{t("components.formComponentsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t("common.name")}</label>
              <Input
                  autoComplete="off"
                placeholder={t("components.enterYourName")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t("common.email")}</label>
              <Input
                  autoComplete="off"
                type="email"
                placeholder={t("components.enterYourEmail")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t("common.category")}</label>
              <Select defaultValue={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("components.selectYourCountry")}/>
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Newsletter</label>
              <Checkbox
                checked={formData.newsletter}
                onChange={(checked) => handleInputChange("newsletter", checked)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t("common.description")}</label>
            <Textarea
              placeholder={t("components.enterYourMessage")}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t("components.planSelection")}</label>
            <RadioGroup defaultValue="intermediate">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="beginner" id={"id1"}/>
                <Label htmlFor={"id1"} variant="secondary">
                  All new messages (Recommended)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="intermediate" id={"id2"}/>
                <Label htmlFor={"id2"} variant="secondary">
                  Direct @mentions
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="advanced" id={"id3"}/>
                <Label htmlFor={"id3"} variant="secondary">
                  Disabled
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex gap-4">
            <Button>{t("components.submitForm")}</Button>
            <Button variant="outline">{t("common.reset")}</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Cards */}
      <Card>
        <CardHeader>
          <CardTitle>{t("components.dataDisplayCards")}</CardTitle>
          <CardDescription>{t("components.dataDisplayCardsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">{t("dashboard.totalUsers")}</p>
                  <p className="text-3xl font-bold">2,543</p>
                </div>
                <Eye className="h-8 w-8 text-blue-200"/>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-200 text-sm">↗ 12%</span>
                <span className="text-blue-100 text-sm ml-2">{t("dashboard.fromLastMonth")}</span>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">{t("dashboard.revenue")}</p>
                  <p className="text-3xl font-bold">$45,678</p>
                </div>
                <Download className="h-8 w-8 text-green-200"/>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-200 text-sm">↗ 23%</span>
                <span className="text-green-100 text-sm ml-2">{t("dashboard.fromLastMonth")}</span>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">{t("dashboard.orders")}</p>
                  <p className="text-3xl font-bold">856</p>
                </div>
                <Heart className="h-8 w-8 text-purple-200"/>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-200 text-sm">↗ 18%</span>
                <span className="text-purple-100 text-sm ml-2">{t("dashboard.fromLastMonth")}</span>
              </div>
            </div>
            
            <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">{t("dashboard.rating")}</p>
                  <p className="text-3xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-orange-200"/>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-200 text-sm">↗ 0.2</span>
                <span className="text-orange-100 text-sm ml-2">{t("dashboard.fromLastMonth")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("components.dataTable")}</CardTitle>
          <CardDescription>{t("components.dataTableDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={sampleUsers} columns={userColumns} searchPlaceholder={t("components.searchUsers")}/>
        </CardContent>
      </Card>
      
      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>{t("components.imageGallery")}</CardTitle>
          <CardDescription>{t("components.imageGalleryDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery images={galleryImages} columns={3}/>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComponentsPage
