export function findOutIfRunningInExtensionContext(): boolean {
    const g = globalThis as any;
    const browser = g.browser || g.chrome;
    // If we have browser APIs and we are in the popup (determined by window width or extension-specific markers)
    // WXT doesn't provide a direct "isPopup" but usually popups are small.
    // A better way is checking the URL or if we are in a tab.
    return !!(browser && browser.tabs && browser.runtime);
}