"use client"

import {useState} from "react"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {useAuthStore} from "@/pages/auth/authStore.ts"
import {useThemeStore} from "@/stores/themeStore"
import {useNavigationStore} from "@/stores/navigationStore"
import {useClickOutside} from "@/hooks/useClickOutside.ts"
import {ChevronDown, Lock, LogOut, Menu, Monitor, Moon, Sun} from "lucide-react"
import {cn} from "@/lib/utils"
import PasswordChange from "@/pages/auth/components/PasswordChange.tsx"

const Header = observer(() => {
  const {t, i18n} = useTranslation()
  const authStore = useAuthStore()
  const themeStore = useThemeStore()
  const navigationStore = useNavigationStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showPasswordDrawer, setShowPasswordDrawer] = useState(false)
  
  const profileMenuRef = useClickOutside<HTMLDivElement>(() => setShowProfileMenu(false), showProfileMenu)
  const languageMenuRef = useClickOutside<HTMLDivElement>(() => setShowLanguageMenu(false), showLanguageMenu)
  const themeMenuRef = useClickOutside<HTMLDivElement>(() => setShowThemeMenu(false), showThemeMenu)
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setShowLanguageMenu(false)
  }
  
  const handleLogout = () => {
    authStore.logout()
    setShowProfileMenu(false)
  }
  
  const handleChangePassword = () => {
    authStore.clearState()
    setShowPasswordDrawer(true)
    setShowProfileMenu(false)
  }
  
  const themeOptions = [
    {value: "light", label: "Light", icon: Sun},
    {value: "dark", label: "Dark", icon: Moon},
    {value: "system", label: "System", icon: Monitor},
  ]
  
  return (
    <>
      <header className="bg-card/95 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigationStore.toggleMobileSidebar()}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-smooth"
            >
              <Menu className="h-5 w-5"/>
            </button>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-accent transition-smooth text-foreground"
              >
                {themeStore.effectiveTheme === "dark" ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
                <ChevronDown className="h-3 w-3"/>
              </button>
              
              {showThemeMenu && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border py-1 z-50 fade-in">
                  {themeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          themeStore.setTheme(option.value as any)
                          setShowThemeMenu(false)
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-accent transition-smooth flex items-center gap-2 text-foreground",
                          themeStore.theme === option.value && "bg-primary/10 text-primary dark:text-primary font-medium",
                        )}
                      >
                        <Icon className="h-4 w-4"/>
                        <span>{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Language Switcher */}
            {/*<div className="relative" ref={languageMenuRef}>*/}
            {/*  <button*/}
            {/*    onClick={() => setShowLanguageMenu(!showLanguageMenu)}*/}
            {/*    className="flex items-center flex gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"*/}
            {/*  >*/}
            {/*    <Globe className="h-4 w-4"/>*/}
            {/*    <span className="text-sm font-medium hidden sm:inline">{i18n.language.toUpperCase()}</span>*/}
            {/*    <ChevronDown className="h-3 w-3"/>*/}
            {/*  </button>*/}
            {/*  */}
            {/*  {showLanguageMenu && (*/}
            {/*    <div*/}
            {/*      className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">*/}
            {/*      <button*/}
            {/*        onClick={() => changeLanguage("en")}*/}
            {/*        className={cn(*/}
            {/*          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",*/}
            {/*          i18n.language === "en" && "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300",*/}
            {/*        )}*/}
            {/*      >*/}
            {/*        English*/}
            {/*      </button>*/}
            {/*      <button*/}
            {/*        onClick={() => changeLanguage("vi")}*/}
            {/*        className={cn(*/}
            {/*          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",*/}
            {/*          i18n.language === "vi" && "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300",*/}
            {/*        )}*/}
            {/*      >*/}
            {/*        Tiếng Việt*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</div>*/}
            
            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-smooth"
              >
                <img
                  src={authStore.user?.avatar || "/avatar-default.svg?height=32&width=32"}
                  alt={authStore.user?.username}
                  className="h-8 w-8 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-smooth"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-sm text-foreground ">{authStore.user?.username}</p>
                  <p className="text-xs text-foreground">{authStore.user?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-foreground"/>
              </button>
              
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border py-1 z-50 fade-in">
                  <button
                    onClick={handleChangePassword}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-smooth flex items-center gap-2 dark:text-gray-300"
                  >
                    <Lock className="h-4 w-4"/>
                    <span>Change Password</span>
                  </button>
                  <hr className="my-1 border-border"/>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-smooth flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="h-4 w-4"/>
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <PasswordChange isOpen={showPasswordDrawer} onClose={() => setShowPasswordDrawer(false)}/>
    </>
  )
})

export default Header
