"use client"

import {Route, Routes} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {useNavigationStore} from "@/stores/navigationStore"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"

// Pages
import DashboardPage from "@/pages/dashboard/DashboardPage"
import LeaderboardPage from "@/pages/leaderboard/LeaderboardPage"
import AccountsPage from "@/pages/accounts/AccountsPage";
import UsersPage from "@/pages/users/UsersPage"
import UsersDetailPage from "@/pages/users/components/UserDetailpage.tsx";
import ConfigsPage from "@/pages/configs/ConfigsPage";
import WelcomePage from "@/components/layout/welcome/WelcomePage";
import ItemsPage from "@/pages/items/ItemsPage.tsx";
import ItemStorePage from "@/pages/itemStores/ItemStorePage.tsx";
import CreateItemStore from "@/pages/itemStores/components/CreateItemStore.tsx";
import EditItemStore from "@/pages/itemStores/components/EditItemStore.tsx";
import ActivityLogsPage from "@/pages/activityLogs/ActivityLogsPage.tsx";
import RewardsPage from "@/pages/rewards/RewardsPage.tsx";
import PoolPage from "@/pages/pool/PoolPage.tsx";
import CreatePool from "@/pages/pool/components/CreatePool.tsx";
import EditPool from "@/pages/pool/components/EditPool.tsx";
import PoolBudgetPage from "@/pages/poolBudget/PoolBudgetPage.tsx";
import TransactionPage from "@/pages/transaction/TransactionPage.tsx";
import NotFoundPage from "@/components/layout/notFound/NotFoundPage.tsx";
import EventPage from "@/pages/events/EventPage.tsx";
import CreateEvent from "@/pages/events/components/CreateEvent.tsx";
import EditEvent from "@/pages/events/components/EditEvent.tsx";
import TaskPage from "@/pages/tasks/TaskPage.tsx";
import CreateTask from "@/pages/tasks/components/CreateTask.tsx";
import EditTask from "@/pages/tasks/components/EditTask.tsx";

const AllRoutes = observer(() => {
  const navigationStore = useNavigationStore()
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {navigationStore.mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
              <Route path="/leaderboard" element={<LeaderboardPage/>}/>
              <Route path="/accounts" element={<AccountsPage/>}/>
              <Route path="/users" element={<UsersPage/>}/>
              <Route path="/users/:id" element={<UsersDetailPage/>}/>
              <Route path="/items" element={<ItemsPage/>}/>
              <Route path="/item-store" element={<ItemStorePage/>}/>
              <Route path="/item-store/create" element={<CreateItemStore/>}/>
              <Route path="/item-store/edit/:id" element={<EditItemStore/>}/> \
              <Route path="/rewards" element={<RewardsPage/>}/>
              <Route path="/pool" element={<PoolPage/>}/>
              <Route path="/pool/create" element={<CreatePool/>}/>
              <Route path="/pool/edit/:id" element={<EditPool/>}/>
              <Route path="/budget" element={<PoolBudgetPage/>}/>
              <Route path="/events" element={<EventPage/>}/>
              <Route path="/events/create" element={<CreateEvent/>}/>
              <Route path="/events/edit/:id" element={<EditEvent/>}/>
              <Route path="/tasks" element={<TaskPage/>}/>
              <Route path="/tasks/create" element={<CreateTask/>}/>
              <Route path="/tasks/edit/:id" element={<EditTask/>}/>
              <Route path="/transaction" element={<TransactionPage/>}/>
              <Route path="/configs" element={<ConfigsPage/>}/>
              <Route path="/activityLogs" element={<ActivityLogsPage/>}/>
              <Route path="*" element={<NotFoundPage/>}/>
              
              {/*<Route path="/products" element={<ProductsPage/>}/>*/}
              {/*<Route path="/products/categories" element={<CategoriesPage/>}/>*/}
              {/*<Route path="/products/categories/sub" element={<SubCategoriesPage/>}/>*/}
              {/*<Route path="/products/inventory" element={<InventoryPage/>}/>*/}
              {/*<Route path="/orders" element={<OrdersPage/>}/>*/}
              {/*<Route path="/analytics" element={<AnalyticsPage/>}/>*/}
              {/*<Route path="/analytics/reports" element={<ReportsPage/>}/>*/}
              {/*<Route path="/settings" element={<SettingsPage/>}/>*/}
              {/*<Route path="/components" element={<ComponentsPage/>}/>*/}
            
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
})

export default AllRoutes
