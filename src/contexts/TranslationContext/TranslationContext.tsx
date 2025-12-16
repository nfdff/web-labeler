import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { MessageKey, SupportedLocale, TranslationFunction } from "@/i18n"
import { DEFAULT_LOCALE } from "@/i18n"
import { useOptionsContext } from "@/contexts/OptionsContext"

interface MessageEntry {
  message: string
  description?: string
}

type MessagesMap = Record<string, MessageEntry>

export interface TranslationContextValue {
  t: TranslationFunction
  currentLocale: SupportedLocale
}

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined
)

const messagesCache = new Map<SupportedLocale, MessagesMap>()

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { options } = useOptionsContext()
  const userLocale = options.locale

  const browserLocale = chrome.i18n
    .getUILanguage()
    .split("-")[0] as SupportedLocale
  const effectiveLocale = userLocale || browserLocale || DEFAULT_LOCALE

  const [messages, setMessages] = useState<MessagesMap | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      if (!userLocale) {
        setMessages(null)
        return
      }

      if (messagesCache.has(effectiveLocale)) {
        setMessages(messagesCache.get(effectiveLocale)!)
        return
      }

      try {
        const response = await fetch(
          `/_locales/${effectiveLocale}/messages.json`
        )
        const loadedMessages = await response.json()
        messagesCache.set(effectiveLocale, loadedMessages)
        setMessages(loadedMessages)
      } catch (error) {
        console.error(`Failed to load locale ${effectiveLocale}:`, error)
        if (effectiveLocale !== DEFAULT_LOCALE) {
          try {
            const response = await fetch(
              `/_locales/${DEFAULT_LOCALE}/messages.json`
            )
            const fallbackMessages = await response.json()
            setMessages(fallbackMessages)
          } catch (fallbackError) {
            console.error("Failed to load fallback locale:", fallbackError)
          }
        }
      }
    }

    loadMessages()
  }, [effectiveLocale, userLocale])

  const t = useCallback<TranslationFunction>(
    (key: MessageKey, substitutions?: string | string[]) => {
      if (!userLocale) {
        return chrome.i18n.getMessage(key, substitutions)
      }

      if (messages && messages[key]) {
        let message = messages[key].message

        if (substitutions) {
          const subs = Array.isArray(substitutions)
            ? substitutions
            : [substitutions]
          subs.forEach((sub, index) => {
            message = message.replace(`$${index + 1}`, sub)
          })
        }

        return message
      }

      const chromeMessage = chrome.i18n.getMessage(key, substitutions)
      if (chromeMessage) {
        return chromeMessage
      }

      console.warn(`Translation missing for key: ${key}`)
      return key
    },
    [messages, userLocale]
  )

  const value = useMemo(
    () => ({ t, currentLocale: effectiveLocale }),
    [t, effectiveLocale]
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export { TranslationContext }
