export interface UseImportFromExtensionReturn {
  importFromExtension: (file: File, combineMode: boolean) => Promise<{ success: boolean }>
  isLoading: boolean
  errorMessage: string | null
}
