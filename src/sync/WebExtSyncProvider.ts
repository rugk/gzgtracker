import type {ConfigField, SyncableRecord, SyncProvider} from './SyncProvider';

/**
 * Sync provider that communicates with the GzGTracker Sync companion
 * WebExtension via CustomEvent messaging.
 *
 * The extension's content script listens for 'gzg-sync-request' CustomEvents
 * on the page's window and dispatches 'gzg-sync-response' events back.
 * The content script forwards calls to the background service worker which
 * accesses wxt/storage (sync area) via comctx.
 *
 * Message protocol (request → response):
 *   { id, action: 'ping' }                          → { id, ok: true }
 *   { id, action: 'pull', storeName }                → { id, ok: true, items: T[] }
 *   { id, action: 'push', storeName, items }         → { id, ok: true }
 */
export class WebExtSyncProvider implements SyncProvider {
    readonly name = 'Browser Extension (wxt/storage sync)';
    readonly key = 'webext';

    readonly configFields: Record<string, ConfigField> = {};

    async testConnection(_config: Record<string, string>): Promise<void> {
        console.log('[WebExtSync] Testing connection…');
        const resp = await this.sendMessage({action: 'ping'});
        if (!resp?.ok) {
            const err = (resp?.error as string) ??
                'Extension did not respond. Is the GzGTracker Sync extension installed?';
            console.error('[WebExtSync] Connection test failed:', err);
            throw new Error(err);
        }
        console.log('[WebExtSync] Connection test OK');
    }

    async pull<T extends SyncableRecord>(
        storeName: string,
        _config: Record<string, string>,
    ): Promise<T[]> {
        console.log(`[WebExtSync] Pulling store "${storeName}"…`);
        const resp = await this.sendMessage({action: 'pull', storeName});
        if (!resp?.ok) {
            const err = (resp?.error as string) ?? 'Pull failed';
            console.error(`[WebExtSync] Pull failed for "${storeName}":`, err);
            throw new Error(err);
        }
        const items = (resp.items ?? []) as T[];
        console.log(`[WebExtSync] Pulled ${items.length} item(s) from "${storeName}"`);
        return items;
    }

    async push<T extends SyncableRecord>(
        storeName: string,
        items: T[],
        _config: Record<string, string>,
    ): Promise<void> {
        console.log(`[WebExtSync] Pushing ${items.length} item(s) to "${storeName}"…`);
        const resp = await this.sendMessage({action: 'push', storeName, items});
        if (!resp?.ok) {
            const err = (resp?.error as string) ?? 'Push failed';
            console.error(`[WebExtSync] Push failed for "${storeName}":`, err);
            throw new Error(err);
        }
        console.log(`[WebExtSync] Push to "${storeName}" OK`);
    }

    /**
     * Send a message to the companion extension's content script via
     * CustomEvent and wait for the response.
     */
    private sendMessage(
        payload: Record<string, unknown>,
        timeoutMs = 5000,
    ): Promise<Record<string, unknown>> {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();

            const timer = setTimeout(() => {
                window.removeEventListener('gzg-sync-response', handler);
                reject(
                    new Error(
                        'Extension did not respond in time. ' +
                        'Make sure the GzGTracker Sync extension is installed and enabled.',
                    ),
                );
            }, timeoutMs);

            const handler = (evt: Event) => {
                const detail = (evt as CustomEvent).detail;
                if (detail?.id !== id) return;
                clearTimeout(timer);
                window.removeEventListener('gzg-sync-response', handler);
                console.log('[WebExtSync] Response received:', detail);
                resolve(detail);
            };

            window.addEventListener('gzg-sync-response', handler);
            console.log('[WebExtSync] Sending request:', {...payload, id});
            window.dispatchEvent(
                new CustomEvent('gzg-sync-request', {detail: {...payload, id}}),
            );
        });
    }
}
