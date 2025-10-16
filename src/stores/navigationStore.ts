import {makeAutoObservable} from "mobx"
import {
  Award,
  BookImageIcon,
  BookUser,
  ChartColumnDecreasingIcon,
  ClipboardClock,
  FileQuestionIcon,
  History,
  LanguagesIcon,
  LayoutDashboard,
  LayoutList,
  ListCheckIcon,
  Package,
  Settings,
  Users,
  Warehouse
} from "lucide-react"

export interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<React.ComponentProps<"svg">> | string
  path?: string
  children?: MenuItem[]
  expanded?: boolean
  roles?: string[]
}

class NavigationStore {
  sidebarCollapsed = false
  mobileSidebarOpen = false
  activeMenuItem = "dashboard"
  allMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "nav.dashboard",
      icon: LayoutDashboard,
      path: "/cms/dashboard",
      roles: ["ADMIN", "OPERATOR"]
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: ChartColumnDecreasingIcon,
      path: "/cms/leaderboard",
      roles: ["ADMIN", "OPERATOR"]
    },
    {
      id: "account",
      label: "nav.accounts",
      icon: BookUser,
      path: "/cms/accounts",
      roles: ["ADMIN"]
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/cms/users",
      roles: ["ADMIN", "OPERATOR", "CC"]
    },
    {
      id: "item",
      label: "Item",
      icon: LayoutList,
      roles: ["ADMIN", "OPERATOR"],
      children: [
        {
          id: "item-list",
          label: "Items",
          icon: Package,
          path: "/cms/items",
        },
        // {
        //   id: "item-store",
        //   label: "Item Store",
        //   icon: Store,
        //   path: "/cms/item-store",
        // },
        {
          id: "rewards",
          label: "Rewards",
          icon: Award,
          path: "/cms/rewards",
        },
      ],
    },
    {
      id: "pool",
      label: "Pool",
      icon: Warehouse,
      path: "/cms/pool",
      roles: ["ADMIN", "OPERATOR"],
      // children: [
      //   {
      //     id: "pool-list",
      //     label: "Pools",
      //     icon: WavesLadder,
      //     path: "/cms/pool",
      //   },
      //   {
      //     id: "pool-budget",
      //     label: "Pool Budget",
      //     icon: BadgeDollarSign,
      //     path: "/cms/budget",
      //   },
      // ]
    },
    {
      id: "events",
      label: "Events",
      icon: BookImageIcon,
      path: "/cms/events",
      roles: ["ADMIN", "OPERATOR"]
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: ListCheckIcon,
      path: "/cms/tasks",
      roles: ["ADMIN", "OPERATOR"]
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: FileQuestionIcon,
      path: "/cms/quiz",
      roles: ["ADMIN", "OPERATOR"]
    },
    {
      id: "transaction",
      label: "Transaction",
      icon: ClipboardClock,
      path: "/cms/transaction",
      roles: ["ADMIN", "OPERATOR", "CC"]
    },
    {
      id: "settings",
      label: "nav.configs",
      icon: Settings,
      path: "/cms/configs",
      roles: ["ADMIN"]
    },
    {
      id: "languages",
      label: "Languages",
      icon: LanguagesIcon,
      path: "/cms/languages",
      roles: ["ADMIN"]
    },
    {
      id: "activityLogs",
      label: "Logs Activity",
      icon: History,
      path: "/cms/activityLogs",
      roles: ["ADMIN", "OPERATOR"]
    },
    // {
    //   id: "products",
    //   label: "nav.products",
    //   icon: "Package",
    //   children: [
    //     {
    //       id: "products-list",
    //       label: "Products List",
    //       icon: "List",
    //       path: "/cms/products",
    //     },
    //     {
    //       id: "products-categories",
    //       label: "Categories",
    //       icon: "Tag",
    //       children: [
    //         {
    //           id: "categories-main",
    //           label: "Main Categories",
    //           icon: "Folder",
    //           path: "/cms/products/categories",
    //         },
    //         {
    //           id: "categories-sub",
    //           label: "Sub Categories",
    //           icon: "FolderOpen",
    //           path: "/cms/products/categories/sub",
    //         },
    //       ],
    //     },
    //     {
    //       id: "products-inventory",
    //       label: "Inventory",
    //       icon: "Warehouse",
    //       path: "/cms/products/inventory",
    //     },
    //   ],
    // },
  ]
  menuItems: MenuItem[] = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  getMenuItems = (roles: string): MenuItem[] => {
    const filterByRole = (items: MenuItem[]): MenuItem[] =>
      items
        .filter(item => !item.roles || item.roles.includes(roles))
        .map(item => ({
          ...item,
          children: item.children ? filterByRole(item.children) : undefined
        }))
    
    this.menuItems = filterByRole(this.allMenuItems)
    return this.menuItems
  }
  
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }
  
  toggleMobileSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen
  }
  
  closeMobileSidebar() {
    this.mobileSidebarOpen = false
  }
  
  setActiveMenuItem(id: string) {
    this.activeMenuItem = id
  }
  
  toggleMenuItem(id: string) {
    const toggleItem = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return {...item, expanded: !item.expanded}
        }
        if (item.children) {
          return {...item, children: toggleItem(item.children)}
        }
        return item
      })
    }
    
    this.menuItems = toggleItem(this.menuItems)
  }
  
  expandMenuItem(id: string) {
    const expandItem = (items: MenuItem[]): MenuItem[] =>
      items.map((item) => {
        if (item.id === id) {
          return {...item, expanded: true}
        }
        if (item.children) {
          return {...item, children: expandItem(item.children)}
        }
        return item
      })
    
    this.menuItems = expandItem(this.menuItems)
  }
  
  findMenuItemById(id: string, items: MenuItem[] = this.menuItems): MenuItem | null {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = this.findMenuItemById(id, item.children)
        if (found) return found
      }
    }
    return null
  }
  
  findParentChain(pathname: string, items: MenuItem[] = this.menuItems, parents: string[] = []): string[] | null {
    for (const item of items) {
      if (item.path && pathname.startsWith(item.path)) {
        return [...parents, item.id]
      }
      if (item.children) {
        const found = this.findParentChain(pathname, item.children, [...parents, item.id])
        if (found) return found
      }
    }
    return null
  }
}

const navigationStore = new NavigationStore()
export const useNavigationStore = () => navigationStore

export {NavigationStore}
export default navigationStore