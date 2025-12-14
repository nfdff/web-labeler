import { useState } from "react"
import { transformEnvMarkerToLabels } from "../../components/ConfigurationManager/Import/FromAnotherExtension/transformers/envMarkerTransformer.ts"
import { EnvMarkerLabel } from "../../components/ConfigurationManager/Import/FromAnotherExtension/types.ts"
import { combineLabels } from "../../components/ConfigurationManager/Import/FromAnotherExtension/utils/combineLabels.ts"
import { useOptionsContext } from "../../contexts"
import { readJsonFile } from "../../utils/fileReader"
import { useImportLabels } from "../useImportLabels"
import { UseImportFromExtensionReturn } from "./types.ts"

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
      let message = "From the file:"

      if (combineMode) {
        const result = combineLabels(transformedLabels, envMarkerData)
        labelsToImport = result.combined

        if (result.originalCount !== result.combinedCount) {
          message = `From the file (${result.originalCount} labels combined into ${result.combinedCount}):`
        }
      }

      confirmAndImport(labelsToImport, {
        title: "Import labels from Environment Marker",
        messagePrefix: message,
      })
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to import labels"
      setErrorMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return { importFromExtension, isLoading, errorMessage }
}
