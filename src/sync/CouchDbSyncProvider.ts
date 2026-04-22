import type {ConfigField, SyncableRecord, SyncProvider} from './SyncProvider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PouchDBStatic = any;
let _PouchDB: PouchDBStatic | null = null;

async function getPouchDB(): Promise<PouchDBStatic> {
    if (!_PouchDB) {
        const mod = await import('pouchdb-browser');
        _PouchDB = mod.default;
    }
    return _PouchDB;
}

/**
 * CouchDB synchronisation provider using PouchDB.
 *
 * ⚠️  UNTESTED — implemented based on the PouchDB / CouchDB replication protocol.
 * Requires a CouchDB-compatible instance with CORS enabled for the app's origin.
 *
 * Each store maps to a CouchDB database (e.g. "gzg-people").
 * PouchDB handles replication, revision tracking, and conflict resolution
 * automatically. A local PouchDB database is kept in sync with the remote.
 */
export class CouchDbSyncProvider implements SyncProvider {
    readonly name = 'CouchDB (PouchDB)';
    readonly key = 'couchdb';

    readonly configFields: Record<string, ConfigField> = {
        url: {label: 'Server URL', type: 'url', placeholder: 'https://couchdb.example.com'},
        username: {label: 'Username', type: 'text', placeholder: 'admin'},
        password: {label: 'Password', type: 'password'},
    };

    /** Cache of PouchDB instances keyed by store name. */
    private _localDbs = new Map<string, PouchDB.Database>();
    private _remoteDbs = new Map<string, PouchDB.Database>();

    private _remoteUrl(config: Record<string, string>, storeName: string): string {
        const base = config.url.replace(/\/+$/, '');
        return `${base}/${encodeURIComponent(storeName)}`;
    }

    private _remoteOpts(config: Record<string, string>): PouchDB.Configuration.RemoteDatabaseConfiguration {
        const opts: PouchDB.Configuration.RemoteDatabaseConfiguration = {};
        if (config.username) {
            opts.auth = {username: config.username, password: config.password ?? ''};
        }
        return opts;
    }

    private async _getLocalDb(storeName: string): Promise<PouchDB.Database> {
        const cached = this._localDbs.get(storeName);
        if (cached) return cached;
        const Pouch = await getPouchDB();
        const db = new Pouch(`gzg-pouchdb-${storeName}`);
        this._localDbs.set(storeName, db);
        return db;
    }

    private async _getRemoteDb(config: Record<string, string>, storeName: string): Promise<PouchDB.Database> {
        const key = `${config.url}/${storeName}`;
        const cached = this._remoteDbs.get(key);
        if (cached) return cached;
        const Pouch = await getPouchDB();
        const db = new Pouch(this._remoteUrl(config, storeName), this._remoteOpts(config));
        this._remoteDbs.set(key, db);
        return db;
    }

    async testConnection(config: Record<string, string>): Promise<void> {
        const res = await fetch(config.url.replace(/\/+$/, ''), {
            headers: config.username
                ? {Authorization: 'Basic ' + btoa(`${config.username}:${config.password ?? ''}`)}
                : {},
        });
        if (!res.ok) {
            throw new Error(`CouchDB connection failed: ${res.status} ${res.statusText}`);
        }
    }

    async pull<T extends SyncableRecord>(
        storeName: string,
        config: Record<string, string>,
    ): Promise<T[]> {
        const localDb = await this._getLocalDb(storeName);
        const remoteDb = await this._getRemoteDb(config, storeName);

        // Replicate remote → local
        await localDb.replicate.from(remoteDb);

        // Read all docs from local PouchDB
        const result = await localDb.allDocs({include_docs: true});
        return result.rows
            .filter((row) => row.doc && !row.id.startsWith('_'))
            .map((row) => {
                const {_id, _rev, ...rest} = row.doc as PouchDB.Core.ExistingDocument<T>;
                return rest as unknown as T;
            });
    }

    async push<T extends SyncableRecord>(
        storeName: string,
        items: T[],
        config: Record<string, string>,
    ): Promise<void> {
        const localDb = await this._getLocalDb(storeName);
        const remoteDb = await this._getRemoteDb(config, storeName);

        // Upsert items into local PouchDB
        for (const item of items) {
            try {
                const existing = await localDb.get(item.id);
                await localDb.put({...item, _id: item.id, _rev: existing._rev});
            } catch (err: unknown) {
                if ((err as PouchDB.Core.Error).status === 404) {
                    await localDb.put({...item, _id: item.id});
                } else {
                    throw err;
                }
            }
        }

        // Replicate local → remote
        await localDb.replicate.to(remoteDb);
    }
}
