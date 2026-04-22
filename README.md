# GzG Tracker

Cashback deal tracker for managing "Geld-zurück" (money-back) submissions.

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Framework  | Vue 3 (Composition API, `<script setup>`) |
| Routing    | Vue Router (hash-based)                   |
| State      | Pinia                                     |
| i18n       | Vue I18n                                  |
| Styling    | Pico CSS (classless/semantic)             |
| Storage    | LocalForage (offline-first)               |
| Build      | Vite 7                                    |
| Tests      | Vitest + Happy-DOM                        |
| Type Check | vue-tsc                                   |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install & Run (Standalone Web App)

```bash
npm install          # install dependencies
npm run dev          # start dev server
npm run build        # type-check + production build
npm run preview      # preview production build
npm test             # run tests
```

### Browser Extension (WXT)

The extension is located in the `extension/` directory but managed from the root.

```bash
npm run wxt:dev           # Start WXT dev mode
npm run wxt:dev:firefox    # Start WXT dev mode for Firefox
npm run wxt:build:firefox # Build for Firefox (extension/.output/firefox-mv2)
```

The extension hosts the full application in both its popup and as a standalone tab (Dashboard). When running inside the
extension, it uses a direct `browser.storage.sync` provider.

## Project Structure

```
src/
├── main.ts          # app entry — creates Vue app, installs plugins
├── App.vue          # root component with nav + router-view
├── router.ts        # Vue Router (hash history, lazy-loaded views)
├── i18n.ts          # Vue I18n setup (en/de)
├── store.ts         # generic LocalForage-backed CRUD store
├── models.ts        # TypeScript interfaces (Person, Iban, Deal, Submission)
├── styles.css       # Pico CSS entry + minimal custom styles
└── views/
    ├── DashboardView.vue
    ├── DealsView.vue
    ├── SubmissionsView.vue
    ├── PeopleView.vue
    ├── IbansView.vue
    └── SettingsView.vue
```
