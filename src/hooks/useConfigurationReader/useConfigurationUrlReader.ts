import browser from "webextension-polyfill"
import { useState } from "react"
import { FetchJsonFromUrlMessage, MessageResponse } from "@/background/types"
import { validateLabelsArray } from "@/utils/schemaValidator"
import { ReadAndValidateResult } from "./types"

export type UseConfigurationUrlReader = () => {
  readAndValidate: (url: string) => Promise<ReadAndValidateResult>
  isLoading: boolean
  errorMessage: string | undefined
}

export const useConfigurationUrlReader: UseConfigurationUrlReader = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined
  )

  const readAndValidate = async (url: string): Promise<ReadAndValidateResult> => {
    setIsLoading(true)
    setErrorMessage(undefined)

    // Create type-safe message
    const message: FetchJsonFromUrlMessage = {
      type: "FETCH_JSON_FROM_URL",
      url,
    }

    try {
      // Fetch data from background script (without validation)
      const response = await browser.runtime.sendMessage(message) as MessageResponse<"FETCH_JSON_FROM_URL">

      setIsLoading(false)

      if (!response.data) {
        const error = response.error || "Failed to fetch data"
        setErrorMessage(error)
        return { success: false, error }
      }

      try {
        if (!Array.isArray(response.data)) {
          throw new Error("The URL doesn't return valid labels array")
        }

        validateLabelsArray(response.data)

        return { success: true, data: response.data }
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Validation error"
        setErrorMessage(error)
        return { success: false, error }
      }
    } catch (error) {
      setIsLoading(false)
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Communication error with background script"

      setErrorMessage(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  return {
    readAndValidate,
    isLoading,
    errorMessage,
  }
}
