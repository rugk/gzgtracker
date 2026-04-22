import {createI18n} from 'vue-i18n';

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
      confirmDelete: 'Are you sure you want to delete this item?',
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
      confirmDelete: 'Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?',
    },
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
