"use client"

import {Route, Routes} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {useNavigationStore} from "@/stores/navigationStore"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"

// Pages
import DashboardPage from "@/pages/dashboard/DashboardPage"
import AccountsPage from "@/pages/accounts/AccountsPage";
import WelcomePage from "@/components/layout/welcome/WelcomePage";
import NotFoundPage from "@/components/layout/notFound/NotFoundPage.tsx";

const AllRoutes = observer(() => {
  const navigationStore = useNavigationStore()
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {navigationStore.mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-white opacity-50 z-40 lg:hidden"
          onClick={() => navigationStore.closeMobileSidebar()}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${navigationStore.mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar/>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header/>
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 via-zinc-10 to-gray-200 dark:bg-gradient-none dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<WelcomePage/>}/>
              <Route path="/dashboard" element={<DashboardPage/>}/>
              <Route path="/accounts" element={<AccountsPage/>}/>
            
              <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
})

export default AllRoutes
