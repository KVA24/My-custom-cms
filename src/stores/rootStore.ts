"use client"

import {createContext, useContext} from "react"
import {AuthStore} from "../pages/auth/authStore.ts"
import {NavigationStore} from "./navigationStore"
import {ThemeStore} from "./themeStore"
import {LanguageStore} from "./languageStore"

class RootStore {
  authStore: AuthStore
  navigationStore: NavigationStore
  themeStore: ThemeStore
  languageStore: LanguageStore
  
  constructor() {
    this.authStore = new AuthStore()
    this.navigationStore = new NavigationStore()
    this.themeStore = new ThemeStore()
    this.languageStore = new LanguageStore()
    
    // Initialize any cross-store dependencies here
    this.initializeCrossStoreDependencies()
  }
  
  private initializeCrossStoreDependencies() {
    // Example: When user activityLogs out, reset navigation state
    // This can be expanded based on your needs
  }
  
  // Utility method to reset all stores (useful for logout)
  resetAllStores() {
    // Reset stores to initial state if needed
    this.navigationStore.sidebarCollapsed = false
    this.navigationStore.activeMenuItem = "dashboard"
  }
}

const rootStore = new RootStore()

// Export individual store access functions
export const useAuthStore = () => rootStore.authStore
export const useNavigationStore = () => rootStore.navigationStore
export const useThemeStore = () => rootStore.themeStore
export const useLanguageStore = () => rootStore.languageStore

const RootStoreContext = createContext(rootStore)

export const useRootStore = () => {
  const context = useContext(RootStoreContext)
  if (!context) {
    throw new Error("useRootStore must be used within RootStoreProvider")
  }
  return context
}

export const RootStoreProvider = RootStoreContext.Provider
export {rootStore}
