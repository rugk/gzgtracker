type Locale = 'en' | 'de';

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'app.title': 'GzG Tracker',
    'nav.dashboard': 'Dashboard',
    'nav.deals': 'Deals',
    'nav.submissions': 'Submissions',
    'nav.people': 'People',
    'nav.ibans': 'IBANs',
    'nav.settings': 'Settings',
    'dashboard.welcome': 'Welcome to GzG Tracker',
    'dashboard.description': 'Track your cashback deals and submissions.',
    'deals.title': 'Deals',
    'deals.empty': 'No deals yet. Add your first deal!',
    'submissions.title': 'Submissions',
    'submissions.empty': 'No submissions yet.',
    'people.title': 'People',
    'people.empty': 'No people added yet.',
    'ibans.title': 'IBANs',
    'ibans.empty': 'No IBANs added yet.',
    'settings.title': 'Settings',
    'settings.language': 'Language',
  },
  de: {
    'app.title': 'GzG Tracker',
    'nav.dashboard': 'Übersicht',
    'nav.deals': 'Aktionen',
    'nav.submissions': 'Einsendungen',
    'nav.people': 'Personen',
    'nav.ibans': 'IBANs',
    'nav.settings': 'Einstellungen',
    'dashboard.welcome': 'Willkommen beim GzG Tracker',
    'dashboard.description': 'Verwalte deine Cashback-Aktionen und Einsendungen.',
    'deals.title': 'Aktionen',
    'deals.empty': 'Noch keine Aktionen. Füge deine erste Aktion hinzu!',
    'submissions.title': 'Einsendungen',
    'submissions.empty': 'Noch keine Einsendungen.',
    'people.title': 'Personen',
    'people.empty': 'Noch keine Personen hinzugefügt.',
    'ibans.title': 'IBANs',
    'ibans.empty': 'Noch keine IBANs hinzugefügt.',
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache',
  },
};

let currentLocale: Locale = 'en';
const listeners = new Set<() => void>();

export function t(key: string): string {
  return messages[currentLocale][key] ?? key;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  listeners.forEach((fn) => fn());
}

export function onLocaleChange(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
