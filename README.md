# GzG Tracker

Cashback deal tracker for managing "Geld-zurück" (money-back) submissions.

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Framework  | Vue 3 (Composition API, `<script setup>`) |
| Routing    | Vue Router (hash-based)                   |
| State      | Pinia                                     |
| i18n       | Vue I18n                                  |
| Styling    | Tailwind CSS 4.x (Vite plugin) & Flowbite |
| Storage    | LocalForage (offline-first)               |
| Build      | Vite 7                                    |
| Tests      | Vitest + Happy-DOM                        |
| Type Check | vue-tsc                                   |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install & Run

```bash
npm install          # install dependencies
npm run dev          # start dev server
npm run build        # type-check + production build
npm run preview      # preview production build
npm test             # run tests
npm run test:watch   # run tests in watch mode
```

## Project Structure

```
src/
├── main.ts          # app entry — creates Vue app, installs plugins
├── App.vue          # root component with nav + router-view
├── router.ts        # Vue Router (hash history, lazy-loaded views)
├── i18n.ts          # Vue I18n setup (en/de)
├── store.ts         # generic LocalForage-backed CRUD store
├── models.ts        # TypeScript interfaces (Person, Iban, Deal, Submission)
├── styles.css       # Tailwind CSS entry
└── views/
    ├── DashboardView.vue
    ├── DealsView.vue
    ├── SubmissionsView.vue
    ├── PeopleView.vue
    ├── IbansView.vue
    └── SettingsView.vue
```
