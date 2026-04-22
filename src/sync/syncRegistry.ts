import type {SyncProvider} from './SyncProvider';
import {CouchDbSyncProvider} from './CouchDbSyncProvider';

/**
 * Registry of all available sync providers.
 * To add a new provider, instantiate it and call `syncRegistry.register(provider)`.
 */
class SyncRegistry {
    private _providers = new Map<string, SyncProvider>();

    register(provider: SyncProvider): void {
        this._providers.set(provider.key, provider);
    }

    get(key: string): SyncProvider | undefined {
        return this._providers.get(key);
    }

    getAll(): SyncProvider[] {
        return [...this._providers.values()];
    }
}

export const syncRegistry = new SyncRegistry();

// Register built-in providers
syncRegistry.register(new CouchDbSyncProvider());
