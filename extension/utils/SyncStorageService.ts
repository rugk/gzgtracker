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
        await storage.setItem(`sync:${storeName}`, items);
    }

    async clearAll(): Promise<void> {
        await storage.clear('sync');
    }
}

export const [provideSyncStorage, injectSyncStorage] = defineProxy(
    () => new SyncStorageService(),
);
