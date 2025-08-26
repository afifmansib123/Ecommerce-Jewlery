export const locales = ['en', 'th'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const languages = {
  en: 'English',
  th: 'ไทย'
};

export const languageFlags = {
  en: '🇺🇸',
  th: '🇹🇭'
};