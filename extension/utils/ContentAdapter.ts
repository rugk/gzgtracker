import type {Adapter, OnMessage, SendMessage} from 'comctx';

/**
 * Comctx adapter for the content-script side.
 *
 * - Sends messages to the background via browser.runtime.sendMessage.
 * - Receives messages from the background via browser.runtime.onMessage.
 */
export default class ContentAdapter implements Adapter {
    sendMessage: SendMessage = (message) => {
        browser.runtime.sendMessage(message);
    };

    onMessage: OnMessage = (callback) => {
        const handler = (message?: unknown) => {
            callback(message);
        };
        browser.runtime.onMessage.addListener(handler);
        return () => browser.runtime.onMessage.removeListener(handler);
    };
}
