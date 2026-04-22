/**
 * Base record shape that all syncable items must satisfy.
 */
export interface SyncableRecord {
    id: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Strategy interface for synchronisation providers.
 *
 * Each provider implements pull (fetch remote items) and push (send local items).
 * The Store orchestrates the merge using updatedAt timestamps (last-write-wins).
 */
export interface SyncProvider {
    /** Human-readable name shown in the UI. */
    readonly name: string;

    /** Unique key used for persistence of credentials / config. */
    readonly key: string;

    /**
     * Configuration fields the provider needs (rendered on the Settings page).
     * Each entry maps a field key to a label, e.g. { url: 'Server URL', username: 'Username' }.
     */
    readonly configFields: Record<string, ConfigField>;

    /**
     * Test the connection with the given config.
     * Resolves on success, rejects with a descriptive error on failure.
     */
    testConnection(config: Record<string, string>): Promise<void>;

    /**
     * Pull all items for a given store from the remote.
     */
    pull<T extends SyncableRecord>(storeName: string, config: Record<string, string>): Promise<T[]>;

    /**
     * Push local items to the remote.
     */
    push<T extends SyncableRecord>(storeName: string, items: T[], config: Record<string, string>): Promise<void>;

    /**
     * Clear all data from the remote (optional).
     */
    clearAll?(): Promise<void>;
}

export interface ConfigField {
    label: string;
    type: 'text' | 'password' | 'url';
    placeholder?: string;
}
