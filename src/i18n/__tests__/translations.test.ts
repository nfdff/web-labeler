import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { describe, expect, it } from "vitest"
import { SUPPORTED_LANGUAGES } from "@/i18n"
import type { SupportedLocale } from "@/i18n"
import { MESSAGE_KEYS } from "../types"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOCALES_DIR = path.join(__dirname, "../../../public/_locales")

// Extract locale codes from SUPPORTED_LANGUAGES constant
const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES.map((lang) => lang.code)

interface TranslationFile {
  [key: string]: {
    message: string
    description?: string
  }
}

describe("Translation Completeness", () => {
  const messageKeysSet = new Set<string>(MESSAGE_KEYS)

  // Test each supported locale (including English)
  SUPPORTED_LOCALES.forEach((locale: SupportedLocale) => {
    describe(`${locale} translations`, () => {
      const localeFile = path.join(LOCALES_DIR, `${locale}/messages.json`)
      const translations: TranslationFile = JSON.parse(
        fs.readFileSync(localeFile, "utf-8")
      )
      const localeKeys = Object.keys(translations)

      it("should have all MESSAGE_KEYS", () => {
        const missingKeys: string[] = []

        MESSAGE_KEYS.forEach((key) => {
          if (!localeKeys.includes(key as string)) {
            missingKeys.push(key)
          }
        })

        if (missingKeys.length > 0) {
          console.log(`\n❌ ${locale} is missing ${missingKeys.length} keys:`)
          missingKeys.forEach((k) => console.log(`   - ${k}`))
        }

        expect(missingKeys).toEqual([])
      })

      it("should not have extra keys", () => {
        const extraKeys = localeKeys.filter((k) => !messageKeysSet.has(k))

        if (extraKeys.length > 0) {
          console.log(`\n⚠️  ${locale} has ${extraKeys.length} extra keys:`)
          extraKeys.forEach((k) => console.log(`   - ${k}`))
        }

        expect(extraKeys).toEqual([])
      })

      it("should have no empty messages", () => {
        const emptyMessages: string[] = []

        Object.entries(translations).forEach(([key, value]) => {
          if (!value.message || value.message.trim() === "") {
            emptyMessages.push(key)
          }
        })

        if (emptyMessages.length > 0) {
          console.log(
            `\n❌ ${locale} has ${emptyMessages.length} empty messages:`
          )
          emptyMessages.forEach((k) => console.log(`   - ${k}`))
        }

        expect(emptyMessages).toEqual([])
      })
    })
  })
})
