# GzGTracker

A privacy-first Progressive Web App (PWA) for tracking Geld-zurück (cashback) deals and submissions.

## Features

- **Track Deals**: Manage cashback deals from various companies and platforms
- **People & Accounts**: Keep track of multiple people and their bank accounts (IBANs)
- **Submissions**: Record which deals you've submitted, using which account and contact information
- **Payment Tracking**: Monitor submission status and received payments
- **Privacy-First**: All data stored locally in your browser (IndexedDB)
- **Offline-First**: Works completely offline after initial load
- **Multi-Language**: Supports English and German
- **Dark Mode**: Light, dark, and auto themes
- **Data Export/Import**: Backup and restore your data as JSON

## Technology Stack

- **Vue 3** (Composition API)
- **Vite** - Fast build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vue I18n** - Internationalization
- **LocalForage** - IndexedDB storage wrapper
- **date-fns** - Date utilities
- **PWA** - Installable app with offline support

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher (or 22.12.0+)

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

The app will be available at `http://localhost:5174` (or next available port).

### Production Build

```sh
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```sh
npm run preview
```

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. Push to the `master` branch
2. GitHub Actions will automatically build and deploy
3. Enable GitHub Pages in repository settings (Settings → Pages → Source: GitHub Actions)

The app will be available at `https://yourusername.github.io/gzgtracker/`

### Other Hosting

The built `dist/` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- Firebase Hosting
- etc.

## Usage

### Managing People

Add people who participate in cashback deals. Each person can have multiple contact variants (emails, addresses, phone numbers) for different deals.

### Managing IBANs

Add bank accounts (IBANs) and link them to their owners. An IBAN can be owned by multiple people (shared accounts).

### Managing Deals

Add cashback deals with:
- Company and product information
- Cashback amount and type (full refund, partial, fixed amount)
- Start and end dates
- Conditions and participation limits
- Source (manual, community sheet, platform)

You can clone deals to quickly create similar ones.

### Recording Submissions

Track your submissions by linking:
- Which deal
- Which person
- Which IBAN
- Which contact information was used
- Purchase details
- Submission status (submitted, approved, paid, rejected)

### Data Management

Export your data for backup or import previously exported data. All data is stored locally in your browser.

## Privacy & Security

- **Local-First**: All data is stored in your browser's IndexedDB
- **No Tracking**: No analytics or tracking scripts
- **No Server**: No data is sent to any server
- **Export Control**: You control your data exports
- **Open Source**: Code is transparent and auditable

## Community Resources

- GzG Deals List: https://docs.google.com/spreadsheets/d/1wcqckNai9SyRbQLt-pj6FHzGM7sypoET9glyAE05u2E/
- Coupons List: https://docs.google.com/spreadsheets/d/1R_O55URinBbyk2Nf6toNa07hSVHGrEt7v4cRLuC9e80/

## Future Enhancements

### Phase 2: Data Integration
- **Google Sheets Import**: Auto-import deals from community spreadsheet
- **Platform API Integration**: Connect to Scondoo, marktguru, couponplatz, ShopBuddies APIs
- **Receipt Image Storage**: Store receipt photos in IndexedDB
- **Advanced Statistics**: Charts, trends, cashback analytics

### Phase 3: Cross-Device Sync
- **Browser Extension Sync**: Use browser.storage.sync API (Chrome/Firefox built-in sync)
- **E2E Encrypted Sync**: Etebase/Etesync SDK integration for self-hosted sync
- **WebDAV Support**: Sync via Nextcloud/ownCloud
- **Cloud Backup**: Optional encrypted cloud storage (Google Drive, Dropbox)

### Phase 4: Mobile Apps
- **Android/iOS Apps** via Capacitor (wraps existing Vue PWA)
  - Native app stores distribution
  - Native features (camera, biometrics)
  - Push notifications for deal reminders
- Alternative: Progressive Web App installation (already works!)

### Phase 5: Browser Extension
- **Full-Featured Extension** (Chrome, Firefox, Edge)
  - Rich UI (popup, sidebar, options pages)
  - Auto-detect GzG deals on websites
  - Auto-fill forms with saved data
  - Quick submission logging
  - Background sync with main app
  - Context menu integrations

### Phase 6: Advanced Features
- **OCR Receipt Scanning**: Auto-extract data from receipt photos
- **Deal Reminders**: Notifications for expiring deals
- **Email Integration**: Auto-parse GzG confirmation emails
- **Multi-Currency**: Support for €, CHF, etc.
- **Sharing**: Export submission reports for families
- **Nextcloud App**: Alternative native Nextcloud integration

## Contributing

This is an open-source project. Contributions, issues, and feature requests are welcome!

## License

MIT

## Support

For issues or questions, please create an issue on GitHub.
