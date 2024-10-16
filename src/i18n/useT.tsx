import frTranslationContent from "locale/fr.json"
import { createContext, ReactNode, SetStateAction, useContext, useMemo, useState } from "react"
import { TFunction } from "src/type"

let enTranslationContent = {}
Object.entries(frTranslationContent).forEach(([key, unit]) => {
  enTranslationContent[key] = { msgstr: key }
})

let translationSet = {
  en: enTranslationContent,
  fr: frTranslationContent,
}

let i18nContext = createContext<{
  t: TFunction
  language: string
  setLanguage: (value: SetStateAction<string>) => void
}>({
  t: (key: string, interpolation?: Record<string, string | number>) => "",
  language: "",
  setLanguage: (value: SetStateAction<string>) => {},
})

export function useT() {
  return useContext(i18nContext)
}

export interface ProvideTProp {
  children: ReactNode | ReactNode[]
}

export function ProvideT(prop: ProvideTProp) {
  let [language, setLanguage] = useState("en")
  let value = useMemo(
    () => ({
      t: (key: string, interpolation: Record<string, string | number> = {}) => {
        let text = translationSet[language][key]?.msgstr ?? `‽${key}`
        Object.entries(interpolation).forEach(([key, value]) => {
          text = text.replaceAll(`{${key}}`, value)
        })
        return text
      },
      language,
      setLanguage,
    }),
    [language],
  )
  return <i18nContext.Provider value={value}>{prop.children}</i18nContext.Provider>
}
