import {makeAutoObservable} from "mobx"
import i18n from "@/i18n/config"

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

class LanguageStore {
  currentLanguage = "en"
  
  availableLanguages: Language[] = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
    },
    {
      code: "vi",
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      flag: "🇻🇳",
    },
  ]
  
  constructor() {
    makeAutoObservable(this)
    this.currentLanguage = i18n.language || "en"
    
    // Listen to i18n language changes
    i18n.on("languageChanged", (lng) => {
      this.currentLanguage = lng
    })
  }
  
  changeLanguage(languageCode: string) {
    i18n.changeLanguage(languageCode)
    this.currentLanguage = languageCode
    localStorage.setItem("preferred-language", languageCode)
  }
  
  get currentLanguageInfo() {
    return this.availableLanguages.find((lang) => lang.code === this.currentLanguage) || this.availableLanguages[0]
  }
  
  get isRTL() {
    // Add RTL languages here if needed
    const rtlLanguages = ["ar", "he", "fa"]
    return rtlLanguages.includes(this.currentLanguage)
  }
}

const languageStore = new LanguageStore()
export const useLanguageStore = () => languageStore

export {LanguageStore}
export default languageStore