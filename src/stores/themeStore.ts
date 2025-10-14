import {makeAutoObservable} from "mobx"

type Theme = "light" | "dark" | "system"

class ThemeStore {
  theme: Theme = "light"
  systemTheme: "light" | "dark" = "light"
  
  constructor() {
    makeAutoObservable(this)
    this.loadThemeFromStorage()
    this.detectSystemTheme()
    this.applyTheme()
  }
  
  private loadThemeFromStorage() {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      this.theme = savedTheme
    }
  }
  
  private detectSystemTheme() {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      this.systemTheme = mediaQuery.matches ? "dark" : "light"
      
      mediaQuery.addEventListener("change", (e) => {
        this.systemTheme = e.matches ? "dark" : "light"
        if (this.theme === "system") {
          this.applyTheme()
        }
      })
    }
  }
  
  private applyTheme() {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      const effectiveTheme = this.theme === "system" ? this.systemTheme : this.theme
      
      root.classList.remove("light", "dark")
      root.classList.add(effectiveTheme)
    }
  }
  
  setTheme(theme: Theme) {
    this.theme = theme
    localStorage.setItem("theme", theme)
    this.applyTheme()
  }
  
  get effectiveTheme() {
    return this.theme === "system" ? this.systemTheme : this.theme
  }
  
  get isDark() {
    return this.effectiveTheme === "dark"
  }
}

const themeStore = new ThemeStore()
export const useThemeStore = () => themeStore

export {ThemeStore}
export default themeStore