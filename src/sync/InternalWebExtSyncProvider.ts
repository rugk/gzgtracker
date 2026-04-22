import {storage} from '@wxt-dev/storage';
import type {ConfigField, SyncableRecord, SyncProvider} from './SyncProvider';

/**
 * Sync provider that uses wxt/storage (that syncs to browser.storage API).
 * It always stores it in the `sync` namespace.
 *
 * Only available when running inside an extension context (popup, options page, etc.).
 */
export class InternalWebExtSyncProvider implements SyncProvider {
    readonly name = 'Internal Extension Storage (wxt/storage)';
    readonly key = 'webext-internal';

    readonly configFields: Record<string, ConfigField> = {};

    isAvailable(): boolean {
        // wxt/storage should be available if we're in the extension
        try {
            return typeof storage !== 'undefined';
        } catch {
            return false;
        }
    }

    async testConnection(_config: Record<string, string>): Promise<void> {
        if (!this.isAvailable()) {
            throw new Error('Storage not available.');
        }
        // Simple write/read test
        const testKey = 'sync:__gzg_sync_test__';
        await storage.setItem(testKey, Date.now());
        await storage.removeItem(testKey);
    }

    async pull<T extends SyncableRecord>(
        storeName: string,
        _config: Record<string, string>,
    ): Promise<T[]> {
        if (!this.isAvailable()) {
            throw new Error('Not running inside a browser extension context.');
        }

        console.log(`[InternalWebExtSync] Pulling store "${storeName}"…`);
        const raw = await storage.getItem(`sync:${storeName}`);
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
        await storage.setItem(`sync:${storeName}`, JSON.stringify(items));
        console.log(`[InternalWebExtSync] Push to "${storeName}" OK`);
    }
}
