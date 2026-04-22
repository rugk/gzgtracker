import {defineConfig} from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-vue'],
    manifest: {
        name: 'GzGTracker Sync',
        description:
            'Companion extension for GzGTracker – syncs data via browser.storage.sync.',
        // Firefox add-on ID for stable identification
        browser_specific_settings: {
            gecko: {
                id: 'gzgtracker-sync@example.org',
            },
        },
        permissions: ['storage'],
    },
});
