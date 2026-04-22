import {storage} from '@wxt-dev/storage';
import {defineProxy} from 'comctx';

/**
 * Service that wraps wxt/storage (sync area) for cross-device data sync.
 *
 * Provided by the background script, injected by the content script.
 * Each store's items are stored as a JSON string under the store name key
 * (wxt/storage handles serialization, but we keep JSON string for compatibility
 * with existing data if needed, or we can just store objects directly).
 */
export class SyncStorageService {
    async ping(): Promise<{ ok: true }> {
        return {ok: true};
    }

    async pull(storeName: string): Promise<unknown[]> {
        const raw = await storage.getItem<string | unknown[]>(`sync:${storeName}`);
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        try {
            return JSON.parse(raw as string) as unknown[];
        } catch {
            return [];
        }
    }

    async push(storeName: string, items: unknown[]): Promise<void> {
        // wxt/storage can store objects directly, but we'll use JSON.stringify 
        // to maintain the exact same format as before in browser.storage.sync
        await storage.setItem(`sync:${storeName}`, JSON.stringify(items));
    }

    async exportAll(): Promise<string> {
        const allKeys = await storage.getKeys();
        const syncKeys = allKeys.filter(key => key.startsWith('sync:'));
        const result: Record<string, unknown> = {};
        for (const key of syncKeys) {
            const val = await storage.getItem(key);
            // Remove 'sync:' prefix for the exported JSON to match browser.storage.sync structure if needed,
            // or just export as is. Usually exportAll was browser.storage.sync.get(null)
            // which returns keys without area prefix.
            result[key.replace(/^sync:/, '')] = val;
        }
        return JSON.stringify(result, null, 2);
    }

    async importAll(json: string): Promise<void> {
        const data = JSON.parse(json) as Record<string, unknown>;
        // Clear all sync: keys
        const allKeys = await storage.getKeys();
        const syncKeys = allKeys.filter(key => key.startsWith('sync:'));
        for (const key of syncKeys) {
            await storage.removeItem(key);
        }
        // Set new data
        for (const [key, value] of Object.entries(data)) {
            await storage.setItem(`sync:${key}`, value);
        }
    }
}

export const [provideSyncStorage, injectSyncStorage] = defineProxy(
    () => new SyncStorageService(),
);
