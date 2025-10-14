"use client"

import {useState} from "react"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {useAuthStore} from "@/pages/auth/authStore.ts"
import {useThemeStore} from "@/stores/themeStore"
import {useNavigationStore} from "@/stores/navigationStore"
import {useClickOutside} from "@/hooks/useClickOutside.ts";
import {ChevronDown, Lock, LogOut, Menu, Monitor, Moon, Settings, Sun, User} from "lucide-react"
import {cn} from "@/lib/utils"
import PasswordChange from "@/pages/auth/components/PasswordChange.tsx";

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
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-2 py-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigationStore.toggleMobileSidebar()}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5"/>
            </button>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-1 px-3 py-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-300"
              >
                {themeStore.effectiveTheme === "dark" ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
                <ChevronDown className="h-3 w-3"/>
              </button>
              
              {showThemeMenu && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
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
                          "w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 dark:text-gray-400",
                          themeStore.theme === option.value &&
                          "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white",
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src={authStore.user?.avatar || "/avatar-default.svg?height=32&width=32"}
                  alt={authStore.user?.username}
                  className="h-8 w-8 rounded-full"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{authStore.user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{authStore.user?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400"/>
              </button>
              
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button
                    onClick={handleChangePassword}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors flex items-center gap-2">
                    <Lock className="h-4 w-4"/>
                    {/*<span>{t("nav.profile")}</span>*/}
                    <span>Change Password</span>
                  </button>
                  {/*<button*/}
                  {/*  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">*/}
                  {/*  <Settings className="h-4 w-4"/>*/}
                  {/*  <span>{t("nav.settings")}</span>*/}
                  {/*</button>*/}
                  <hr className="my-1 border-gray-200 dark:border-gray-700"/>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
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
