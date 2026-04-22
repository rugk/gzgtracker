import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      deals: 'Deals',
      submissions: 'Submissions',
      people: 'People',
      ibans: 'IBANs',
      settings: 'Settings',
    },
    common: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      noData: 'No data yet.',
    },
  },
  de: {
    nav: {
      dashboard: 'Übersicht',
      deals: 'Aktionen',
      submissions: 'Einreichungen',
      people: 'Personen',
      ibans: 'IBANs',
      settings: 'Einstellungen',
    },
    common: {
      add: 'Hinzufügen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      search: 'Suchen',
      noData: 'Noch keine Daten.',
    },
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
