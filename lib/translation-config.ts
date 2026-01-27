export const TRANSLATION_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', code: 'en' },
  ar: { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
  sv: { name: 'Swedish', flag: '🇸🇪', code: 'sv' },
  es: { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  fr: { name: 'French', flag: '🇫🇷', code: 'fr' },
  de: { name: 'German', flag: '🇩🇪', code: 'de' },
  pt: { name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
  it: { name: 'Italian', flag: '🇮🇹', code: 'it' },
  nl: { name: 'Dutch', flag: '🇳🇱', code: 'nl' }
} as const;

export type TranslationLanguage = keyof typeof TRANSLATION_LANGUAGES;

export const getLanguageName = (code: string): string => {
  return TRANSLATION_LANGUAGES[code as TranslationLanguage]?.name || 'English';
};

export const getLanguageFlag = (code: string): string => {
  return TRANSLATION_LANGUAGES[code as TranslationLanguage]?.flag || '🇺🇸';
};
