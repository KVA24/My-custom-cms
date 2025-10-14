"use client"

import {observer} from "mobx-react-lite"
import {useNavigationStore} from "@/stores/navigationStore"
import Sidebar from "./Sidebar"
import Header from "./Header"

const AppLayout = observer(({children}: { children: React.ReactNode }) => {
  const navigationStore = useNavigationStore()
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {navigationStore.mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => navigationStore.closeMobileSidebar()}
        />
      )}
      
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${navigationStore.mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar/>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
})

export default AppLayout
