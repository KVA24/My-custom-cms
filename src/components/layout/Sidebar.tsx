"use client"

import {Link, matchPath, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {type MenuItem, useNavigationStore} from "@/stores/navigationStore"
import {cn} from "@/lib/utils"
import {useEffect, useState} from "react"
import {ChevronDown, ChevronRight, Menu,} from "lucide-react"
import authStore from "@/pages/auth/authStore.ts";

const Sidebar = observer(() => {
  const {t} = useTranslation()
  const location = useLocation()
  const navigationStore = useNavigationStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  
  useEffect(() => {
    navigationStore.menuItems = navigationStore.getMenuItems(authStore.user?.role || "ADMIN")
  }, []);
  
  useEffect(() => {
    const chain = navigationStore.findParentChain(location.pathname)
    if (chain) {
      chain.forEach((id) => navigationStore.expandMenuItem(id))
    }
  }, [location.pathname, navigationStore])
  
  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon
    const isActive = item.path ? !!matchPath({path: item.path, end: false}, location.pathname) : false
    
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = item.expanded
    
    const handleClick = () => {
      if (hasChildren) {
        navigationStore.toggleMenuItem(item.id)
      } else if (item.path) {
        navigationStore.setActiveMenuItem(item.id)
      }
    }
    
    const renderPopoverMenu = () => {
      if (!navigationStore.sidebarCollapsed || hoveredItem !== item.id) return null
      
      return (
        <div
          className="absolute left-full ml-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-48"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Main item */}
          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-3"
              onClick={() => {
                navigationStore.setActiveMenuItem(item.id)
                setHoveredItem(null)
              }}
            >
              <Icon className="h-4 w-4"/>
              {t(item.label)}
            </Link>
          ) : (
            <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 gap-3">
              <Icon className="h-4 w-4"/>
              {t(item.label)}
            </div>
          )}
          
          {/* Children items */}
          {hasChildren && item.children && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              {item.children.map((child) => {
                const ChildIcon = child.icon
                return (
                  <div key={child.id}>
                    {child.path ? (
                      <Link
                        to={child.path}
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 gap-3"
                        onClick={() => {
                          navigationStore.setActiveMenuItem(child.id)
                          setHoveredItem(null)
                        }}
                      >
                        <ChildIcon className="h-4 w-4"/>
                        {t(child.label)}
                      </Link>
                    ) : (
                      <div className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 gap-3">
                        <ChildIcon className="h-4 w-4"/>
                        {t(child.label)}
                      </div>
                    )}
                    
                    {/* Grandchildren items */}
                    {child.children && child.children.length > 0 && (
                      <div style={{ paddingLeft: `${16 + level * 16}px` }}>
                        {child.children.map((grandChild) => (
                          <Link
                            key={grandChild.id}
                            to={grandChild.path || "#"}
                            className="flex items-center px-6 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-500"
                            onClick={() => {
                              if (grandChild.path) {
                                navigationStore.setActiveMenuItem(grandChild.id)
                                setHoveredItem(null)
                              }
                            }}
                          >
                            {t(grandChild.label)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>
      )
    }
    
    return (
      <div key={item.id} className="relative">
        {item.path ? (
          <Link
            to={item.path}
            onClick={handleClick}
            onMouseEnter={() => navigationStore.sidebarCollapsed && setHoveredItem(item.id)}
            onMouseLeave={() => !navigationStore.sidebarCollapsed && setHoveredItem(null)}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors relative text-gray-600 dark:text-white",
              "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
              isActive && "bg-blue-100 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900 dark:text-white",
              !navigationStore.sidebarCollapsed && level > 0 && "ml-4",
              navigationStore.sidebarCollapsed && "justify-center px-2",
            )}
            style={{paddingLeft: navigationStore.sidebarCollapsed ? undefined : `${16 + level * 16}px`}}
          >
            <Icon className="h-5 w-5 shrink-0"/>
            {!navigationStore.sidebarCollapsed && (
              <>
                <span className="ml-3">{t(item.label)}</span>
                {hasChildren && (
                  <span className="ml-auto">
                    {isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : (
          <button
            onClick={handleClick}
            onMouseEnter={() => navigationStore.sidebarCollapsed && setHoveredItem(item.id)}
            onMouseLeave={() => !navigationStore.sidebarCollapsed && setHoveredItem(null)}
            className={cn(
              "w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors relative dark:text-white",
              "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 text-left",
              navigationStore.sidebarCollapsed && "justify-center px-2",
            )}
            style={{paddingLeft: navigationStore.sidebarCollapsed ? undefined : `${16 + level * 16}px`}}
          >
            <Icon className="h-5 w-5 shrink-0"/>
            {!navigationStore.sidebarCollapsed && (
              <>
                <span className="ml-3">{t(item.label)}</span>
                {hasChildren && (
                  <span className="ml-auto">
                    {isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                  </span>
                )}
              </>
            )}
          </button>
        )}
        {renderPopoverMenu()}
        
        {hasChildren && isExpanded && !navigationStore.sidebarCollapsed && (
          <div
            className="mt-1 flex flex-col gap-1">{item.children?.map((child) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 h-full",
        navigationStore.sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className={cn(
        "flex items-center p-2 px-4 border-b border-gray-200 dark:border-gray-700",
        navigationStore.sidebarCollapsed ? "justify-center" : "justify-between",
      )}>
        {!navigationStore.sidebarCollapsed && (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">LTM Vali CMS</h1>
        )}
        <button
          onClick={() => navigationStore.toggleSidebar()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
        >
          <Menu className="h-5 w-5"/>
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="flex flex-col gap-2">{navigationStore.menuItems.map((item) => renderMenuItem(item))}</div>
      </nav>
    </div>
  )
})

export default Sidebar
