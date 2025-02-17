import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Load translations using HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind i18n to React
  .init({
    fallbackLng: 'en', // Default language
    supportedLngs: ['en', 'vi'], // Supported languages
    lng: localStorage.getItem('i18nextLng') || 'en', // Manually set language from localStorage
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      loadPath: '/i18n/{{lng}}.json', // Absolute path to public folder
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'querystring', 'cookie'],
      caches: ['localStorage'],
    },
  });

export default i18n;
