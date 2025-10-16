import {makeAutoObservable} from "mobx"
import {
  AntennaIcon,
  BookAudioIcon,
  ChartColumnIcon,
  FileVideo2Icon,
  FilmIcon,
  HistoryIcon,
  HouseIcon,
  LayoutDashboard,
  MonitorPlayIcon,
  NotebookIcon,
  PodcastIcon,
  TvIcon,
  User2Icon,
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
      id: "home",
      label: "Home",
      icon: HouseIcon,
      roles: ["OWNER", "ADMIN", "OPERATOR"],
      children: [
        {
          id: "home-dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/cms/dashboard",
        },
        {
          id: "home-user",
          label: "User Access",
          icon: User2Icon,
          path: "/cms/user-access",
        },
        {
          id: "home-log",
          label: "Log Activity",
          icon: HistoryIcon,
          path: "/cms/log-activity",
        },
      ],
    },
    {
      id: "content",
      label: "Content",
      icon: TvIcon,
      roles: ["OWNER", "ADMIN", "OPERATOR"],
      children: [
        {
          id: "content-channel",
          label: "Channels",
          icon: AntennaIcon,
          path: "/cms/channels",
        },
        {
          id: "content-streams",
          label: "Streams",
          icon: PodcastIcon,
          path: "/cms/streams",
        },
      ],
    },
    {
      id: "campaign",
      label: "Campaign",
      icon: BookAudioIcon,
      roles: ["OWNER", "ADMIN", "OPERATOR"],
      children: [
        {
          id: "campaign-ads",
          label: "Ads",
          icon: MonitorPlayIcon,
          path: "/cms/ads",
        },
        {
          id: "campaign-report",
          label: "Report",
          icon: ChartColumnIcon,
          path: "/cms/report",
        },
      ],
    },
    {
      id: "creatives",
      label: "Creatives",
      icon: FileVideo2Icon,
      roles: ["OWNER", "ADMIN", "OPERATOR"],
      children: [
        {
          id: "creatives-video",
          label: "Video",
          icon: FilmIcon,
          path: "/cms/creatives-video",
        },
        {
          id: "creatives-banner",
          label: "Banner",
          icon: NotebookIcon,
          path: "/cms/creatives-banner",
        },
      ],
    },
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