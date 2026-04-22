import localforage from 'localforage';
import type {SyncableRecord} from './SyncProvider';
import {syncRegistry} from './syncRegistry';

const SYNC_CONFIG_STORE = localforage.createInstance({name: 'gzg-sync-config'});

/** All store names that participate in sync. */
const STORE_NAMES = ['gzg-people', 'gzg-ibans', 'gzg-deals', 'gzg-submissions'] as const;

export interface SyncConfig {
    providerKey: string;
    config: Record<string, string>;
}

/**
 * Central sync service.
 * Persists the chosen provider + credentials and orchestrates sync across all stores.
 */
class SyncService {
    async saveConfig(cfg: SyncConfig): Promise<void> {
        await SYNC_CONFIG_STORE.setItem('active', cfg);
    }

    async loadConfig(): Promise<SyncConfig | null> {
        return SYNC_CONFIG_STORE.getItem<SyncConfig>('active');
    }

    async clearConfig(): Promise<void> {
        await SYNC_CONFIG_STORE.removeItem('active');
    }

    /**
     * Run a full bidirectional sync (last-write-wins) for all stores.
     */
    async syncAll(): Promise<void> {
        const cfg = await this.loadConfig();
        if (!cfg) throw new Error('No sync provider configured');

        const provider = syncRegistry.get(cfg.providerKey);
        if (!provider) throw new Error(`Unknown sync provider: ${cfg.providerKey}`);

        for (const storeName of STORE_NAMES) {
            await this._syncStore(storeName, provider, cfg.config);
        }
    }

    private async _syncStore(
        storeName: string,
        provider: {
            pull: <T extends SyncableRecord>(s: string, c: Record<string, string>) => Promise<T[]>;
            push: <T extends SyncableRecord>(s: string, items: T[], c: Record<string, string>) => Promise<void>
        },
        config: Record<string, string>,
    ): Promise<void> {
        const localStore = localforage.createInstance({name: storeName});

        // Gather local items
        const local = new Map<string, SyncableRecord>();
        await localStore.iterate<SyncableRecord, void>((value) => {
            local.set(value.id, value);
        });

        // Pull remote
        const remote = await provider.pull<SyncableRecord>(storeName, config);

        // Merge: last-write-wins
        const toPush: SyncableRecord[] = [];
        const merged = new Map(local);

        for (const remoteItem of remote) {
            const localItem = merged.get(remoteItem.id);
            if (!localItem || remoteItem.updatedAt > localItem.updatedAt) {
                merged.set(remoteItem.id, remoteItem);
                // Write newer remote item to local
                await localStore.setItem(remoteItem.id, remoteItem);
            }
        }

        // Determine items to push (local is newer or doesn't exist remotely)
        const remoteMap = new Map(remote.map((r) => [r.id, r]));
        for (const [id, item] of merged) {
            const remoteItem = remoteMap.get(id);
            if (!remoteItem || item.updatedAt > remoteItem.updatedAt) {
                toPush.push(item);
            }
        }

        if (toPush.length > 0) {
            await provider.push(storeName, toPush, config);
        }
    }
}

export const syncService = new SyncService();
