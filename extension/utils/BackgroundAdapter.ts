import type {Adapter, Message, OnMessage, SendMessage} from 'comctx';

export interface MessageMeta {
    tabId: number;
}

/**
 * Comctx adapter for the background script side.
 *
 * - Receives messages via browser.runtime.onMessage (from content scripts).
 * - Sends responses back via browser.tabs.sendMessage (to the originating tab).
 */
export default class BackgroundAdapter implements Adapter<MessageMeta> {
    sendMessage: SendMessage<MessageMeta> = async (message) => {
        const tabId = message.meta?.tabId;
        if (tabId != null) {
            await browser.tabs.sendMessage(tabId, message);
        }
    };

    onMessage: OnMessage<MessageMeta> = (callback) => {
        const handler = (
            message: Partial<Message<MessageMeta>> | undefined,
            sender: browser.Runtime.MessageSender,
        ) => {
            if (message && sender.tab?.id != null) {
                message.meta = {...message.meta, tabId: sender.tab.id} as MessageMeta;
            }
            callback(message);
        };
        browser.runtime.onMessage.addListener(handler);
        return () => browser.runtime.onMessage.removeListener(handler);
    };
}
