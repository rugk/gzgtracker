import ContentAdapter from '../utils/ContentAdapter';
import {injectSyncStorage} from '../utils/SyncStorageService';

/**
 * Content script that bridges the web page ↔ background service.
 *
 * The web page dispatches a CustomEvent 'gzg-sync-request' with a detail
 * payload ({ id, action, ... }).  This script forwards the call to the
 * background via comctx, then dispatches a 'gzg-sync-response' CustomEvent
 * back to the page with the result.
 */
export default defineContentScript({
    matches: ['*://localhost/*', '*://127.0.0.1/*'],
    runAt: 'document_start',

    async main() {
        const storage = injectSyncStorage(new ContentAdapter());

        window.addEventListener('gzg-sync-request', async (evt) => {
            const detail = (evt as CustomEvent).detail;
            const {id, action, storeName, items} = detail ?? {};
            console.log('[GzGTracker Sync] Request received:', {id, action, storeName});

            let response: Record<string, unknown>;
            try {
                switch (action) {
                    case 'ping': {
                        const result = await storage.ping();
                        response = {id, ok: result.ok};
                        break;
                    }
                    case 'pull': {
                        const pulled = await storage.pull(storeName);
                        response = {id, ok: true, items: pulled};
                        break;
                    }
                    case 'push': {
                        await storage.push(storeName, items);
                        response = {id, ok: true};
                        break;
                    }
                    case 'clearAll': {
                        await storage.clearAll();
                        response = {id, ok: true};
                        break;
                    }
                    default:
                        response = {id, ok: false, error: `Unknown action: ${action}`};
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error('[GzGTracker Sync] Error handling request:', msg);
                response = {id, ok: false, error: msg};
            }

            console.log('[GzGTracker Sync] Sending response:', response);
            window.dispatchEvent(
                new CustomEvent('gzg-sync-response', {detail: response}),
            );
        });

        console.log('[GzGTracker Sync] Content script ready');
    },
});
