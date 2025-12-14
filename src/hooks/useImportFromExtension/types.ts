export interface UseImportFromExtensionReturn {
  importFromExtension: (file: File, combineMode: boolean) => Promise<void>
  isLoading: boolean
  errorMessage: string | null
}
