import BackgroundAdapter from '../utils/BackgroundAdapter';
import {provideSyncStorage} from '../utils/SyncStorageService';

export default defineBackground(() => {
    provideSyncStorage(new BackgroundAdapter());
    console.log('[GzGTracker Sync] Background service started', {
        id: browser.runtime.id,
    });
});
