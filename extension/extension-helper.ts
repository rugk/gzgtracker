export function openFullTab() {
    browser.tabs.create({url: browser.runtime.getURL('/dashboard.html')});
}