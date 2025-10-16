"use client"

import type React from "react"
import {useState} from "react"
import {ChevronDown, ChevronUp, Search} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
}

export function DataTable<T extends Record<string, any>>({
                                                           data,
                                                           columns,
                                                           searchable = true,
                                                           searchPlaceholder = "Search...",
                                                           className,
                                                         }: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  
  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }
  
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true
    return Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
  })
  
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })
  
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
          <Input
            autoComplete="off"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="text-left py-3 px-4 font-medium text-gray-500">
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column.key)}
                    className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700"
                  >
                      <span className="flex items-center gap-1">
                        <span>{column.label}</span>
                        {sortColumn === column.key && (
                          <>
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4"/>
                            ) : (
                              <ChevronDown className="h-4 w-4"/>
                            )}
                          </>
                        )}
                      </span>
                  </Button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={index}
              className=""
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="py-4 px-4">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      
      {sortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">{searchTerm ? "No results found" : "No data available"}</div>
      )}
    </div>
  )
}
