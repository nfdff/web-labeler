import { useContext } from "react"
import { TranslationContext } from "@/contexts"

export function useTranslationContext() {
  const context = useContext(TranslationContext)

  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within TranslationProvider"
    )
  }

  return context
}
