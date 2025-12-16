import { LanguageConfig, SupportedLocale } from "./types.ts";

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English", flag: "GB" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "RU" },
];

export const DEFAULT_LOCALE: SupportedLocale = "en";
