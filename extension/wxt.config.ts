import {defineConfig} from 'wxt';
import path from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-vue'],
    vite: () => ({
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../src'),
            },
        }
    }),
    manifest: {
        name: 'GzG Tracker',
        description:
            'GzG Tracker Extension – syncs data via browser.storage.sync.',
        // Firefox add-on ID for stable identification
        browser_specific_settings: {
            gecko: {
                id: 'gzgtracker-sync@example.org',
            },
        },
        permissions: ['storage'],
        action: {
            default_popup: 'entrypoints/popup/index.html',
            default_title: 'GzG Tracker',
        },
    },
});
