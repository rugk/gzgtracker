import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'

const messages = {
  en,
  de
}

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.startsWith('de') ? 'de' : 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
