import {defineProxy} from 'comctx';
import {browser} from "wxt/browser";

/**
 * Service that wraps browser.storage.sync for cross-device data sync.
 *
 * Provided by the background script, injected by the content script.
 * Each store's items are stored as a JSON string under the store name key
 * (browser.storage.sync has an 8 KB per-key / 100 KB total limit, so large
 * datasets will need chunking in the future).
 */
export class SyncStorageService {
    async ping(): Promise<{ ok: true }> {
        return {ok: true};
    }

    async pull(storeName: string): Promise<unknown[]> {
        const result = await browser.storage.sync.get(storeName);
        const raw = result[storeName];
        if (!raw) return [];
        try {
            return JSON.parse(raw as string) as unknown[];
        } catch {
            return [];
        }
    }

    async push(storeName: string, items: unknown[]): Promise<void> {
        await browser.storage.sync.set({[storeName]: JSON.stringify(items)});
    }

    async exportAll(): Promise<string> {
        const all = await browser.storage.sync.get(null);
        return JSON.stringify(all, null, 2);
    }

    async importAll(json: string): Promise<void> {
        const data = JSON.parse(json);
        await browser.storage.sync.clear();
        await browser.storage.sync.set(data);
    }
}

export const [provideSyncStorage, injectSyncStorage] = defineProxy(
    () => new SyncStorageService(),
);
