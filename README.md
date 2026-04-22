# GzG Tracker

Cashback deal tracker for managing "Geld-zurück" (money-back) submissions. Built with **Lit** (Web Components), **Tailwind CSS 4**, and **Vite**.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Components  | [Lit](https://lit.dev/) + TypeScript |
| Styling     | [Tailwind CSS 4](https://tailwindcss.com/) (Vite plugin) |
| Storage     | [LocalForage](https://localforage.github.io/localForage/) (offline-first) |
| Routing     | Vanilla hash-based router           |
| i18n        | `@lit/localize` (planned)           |
| Build       | [Vite 7](https://vite.dev/)         |
| Tests       | [Vitest](https://vitest.dev/) + Happy-DOM |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install

```sh
npm install
```

### Develop

```sh
npm run dev
```

Opens a dev server at `http://localhost:5173` with hot-module replacement.

### Build

```sh
npm run build
```

Produces a static build in `dist/` — ready for GitHub Pages or any static host.

### Preview Production Build

```sh
npm run preview
```

### Test

```sh
npm test            # single run
npm run test:watch  # watch mode
```

## Project Structure

```
src/
├── main.ts                  # entry point
├── router.ts                # hash-based routing
├── i18n.ts                  # internationalisation helpers
├── styles.css               # Tailwind CSS entry
├── components/
│   ├── gzg-app.ts           # app shell & navigation
│   └── views/
│       ├── gzg-dashboard.ts
│       ├── gzg-deals.ts
│       ├── gzg-submissions.ts
│       ├── gzg-people.ts
│       ├── gzg-ibans.ts
│       └── gzg-settings.ts
```

## License

Private — not yet published.
