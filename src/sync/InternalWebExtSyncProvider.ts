import type {ConfigField, SyncableRecord, SyncProvider} from './SyncProvider';
import {browser} from "wxt/browser";

/**
 * Sync provider that uses browser.storage.sync directly.
 * Only available when running inside an extension context (popup, options page, etc.).
 */
export class InternalWebExtSyncProvider implements SyncProvider {
    readonly name = 'Internal Extension Storage (direct)';
    readonly key = 'webext-internal';

    readonly configFields: Record<string, ConfigField> = {};

    isAvailable(): boolean {
        return !!(browser && browser.storage && browser.storage.sync);
    }

    async testConnection(_config: Record<string, string>): Promise<void> {
        if (!this.isAvailable()) {
            throw new Error('Not running inside a browser extension context.');
        }
        // Simple write/read test
        const testKey = '__gzg_sync_test__';
        await browser.storage.sync.set({[testKey]: Date.now()});
        await browser.storage.sync.remove(testKey);
    }

    async pull<T extends SyncableRecord>(
        storeName: string,
        _config: Record<string, string>,
    ): Promise<T[]> {
        if (!this.isAvailable()) {
            throw new Error('Not running inside a browser extension context.');
        }

        console.log(`[InternalWebExtSync] Pulling store "${storeName}"…`);
        const result = await browser.storage.sync.get(storeName);
        const raw = result[storeName];
        if (!raw) return [];

        const items = (typeof raw === 'string' ? JSON.parse(raw) : raw) as T[];
        console.log(`[InternalWebExtSync] Pulled ${items.length} item(s) from "${storeName}"`);
        return items;
    }

    async push<T extends SyncableRecord>(
        storeName: string,
        items: T[],
        _config: Record<string, string>,
    ): Promise<void> {
        if (!this.isAvailable()) {
            throw new Error('Not running inside a browser extension context.');
        }

        console.log(`[InternalWebExtSync] Pushing ${items.length} item(s) to "${storeName}"…`);
        // We use JSON.stringify to match the companion extension's format
        await browser.storage.sync.set({[storeName]: JSON.stringify(items)});
        console.log(`[InternalWebExtSync] Push to "${storeName}" OK`);
    }
}
