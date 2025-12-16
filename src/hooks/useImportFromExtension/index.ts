import { useState } from "react"
import { transformEnvMarkerToLabels } from "@/components/ConfigurationManager/Import/FromAnotherExtension/transformers/envMarkerTransformer.ts"
import { EnvMarkerLabel } from "@/components/ConfigurationManager/Import/FromAnotherExtension/types.ts"
import { combineLabels } from "@/components/ConfigurationManager/Import/FromAnotherExtension/utils/combineLabels.ts"
import { useOptionsContext } from "@/contexts"
import { readJsonFile } from "@/utils/fileReader"
import { useImportLabels } from "../useImportLabels"
import { UseImportFromExtensionReturn } from "./types.ts"
import { useTranslation } from "@/contexts"

function validateEnvMarkerData(
  data: unknown
): asserts data is EnvMarkerLabel[] {
  if (!Array.isArray(data)) {
    throw new Error("The file doesn't contain a valid array")
  }

  if (data.length === 0) {
    throw new Error("The file is empty")
  }

  data.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid item at index ${index}`)
    }

    const required = [
      "address",
      "color",
      "fontSize",
      "name",
      "position",
      "uuid",
    ]
    required.forEach((field) => {
      if (!(field in item)) {
        throw new Error(`Missing required field "${field}" at index ${index}`)
      }
    })
  })
}

export function useImportFromExtension(): UseImportFromExtensionReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()
  const { confirmAndImport } = useImportLabels({
    labels: options.labels,
    dispatch,
    updateSyncSettings: false,
  })

  const importFromExtension = async (file: File, combineMode: boolean) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const envMarkerData = await readJsonFile(file)

      validateEnvMarkerData(envMarkerData)

      const transformedLabels = transformEnvMarkerToLabels(envMarkerData)

      let labelsToImport = transformedLabels
      let message = t("importLabels_prefix_extension")

      if (combineMode) {
        const result = combineLabels(transformedLabels, envMarkerData)
        labelsToImport = result.combined

        if (result.originalCount !== result.combinedCount) {
          message = t("importLabels_prefix_extension_combined", [
            String(result.originalCount),
            String(result.combinedCount),
          ])
        }
      }

      confirmAndImport(labelsToImport, {
        title: t("importLabels_title_fromExtension"),
        messagePrefix: message,
      })

      return { success: true }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : t("importFromExtension_error_title")
      setErrorMessage(errorMsg)
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return { importFromExtension, isLoading, errorMessage }
}
