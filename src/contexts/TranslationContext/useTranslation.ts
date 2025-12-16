import { useTranslationContext } from "@/contexts"

/**
 * Hook to access translation function and locale.
 * This is the primary hook to use for translations.
 *
 * @example
 * const { t } = useTranslation()
 * return <div>{t('common_save')}</div>
 */
export function useTranslation() {
  return useTranslationContext()
}
