import { MAX_RECONNECTS_IN_A_ROW, SseConnectionStatus, type SseConnectionStatusValues } from './logic/constants';
import type { SseClientConstructorProps, SseEventListener, SubscribeProps } from './types';

/**
 * An `EventSource` that outlives the access token.
 *
 * Once the access token expires, the server closes the stream, and the browser reconnects with the cookie it has.
 * If that one expired too, the reconnect gets a 401 and the browser gives up for good.
 * At that point, the client refreshes the session and opens a new `EventSource`.
 *
 * Subscriptions belong to the client, not to a connection: they stay attached across reconnects,
 * and can be made before connecting.
 */
export class SseClient {
  private readonly url: string;
  private readonly refreshSession: () => Promise<boolean>;
  private readonly onStatusChange?: (status: SseConnectionStatusValues) => void;

  private readonly listeners = new Map<string, Set<SseEventListener>>();
  private eventSource: EventSource | null = null;
  private status: SseConnectionStatusValues = SseConnectionStatus.Idle;
  private reconnectsInARow = 0;

  constructor(props: SseClientConstructorProps) {
    const { url, refreshSession, onStatusChange } = props;

    this.url = url;
    this.refreshSession = refreshSession;
    this.onStatusChange = onStatusChange;
  }

  connect() {
    this.closeEventSourceIfExists();
    this.reconnectsInARow = 0;
    this.setStatus(SseConnectionStatus.Connecting);
    this.createNewEventSource();
  }

  disconnect(): void {
    if (this.status === SseConnectionStatus.Idle) return;

    this.closeEventSourceIfExists();
    this.setStatus(SseConnectionStatus.Closed);
  }

  /**
   * @returns a function that unsubscribes.
   */
  subscribe(props: SubscribeProps): () => void {
    const { eventName, listener } = props;

    const eventListeners = this.listeners.get(eventName) ?? new Set<SseEventListener>();
    eventListeners.add(listener);
    this.listeners.set(eventName, eventListeners);

    // Adding the same listener twice is ignored by the browser, so this is safe for an event that has listeners already.
    this.eventSource?.addEventListener(eventName, this.dispatchEvent);

    const unsubscribe = () => {
      this.unsubscribe({ eventName, listener });
    };

    return unsubscribe;
  }

  getStatus(): SseConnectionStatusValues {
    return this.status;
  }

  private closeEventSourceIfExists(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }

  private setStatus(status: SseConnectionStatusValues): void {
    if (status === this.status) return;

    this.status = status;
    this.onStatusChange?.(status);
  }

  /**
   * Creates a new `EventSource` instance, and opens a new connection.
   * Also adds event listeners for the existing subscriptions.
   */
  private createNewEventSource(): void {
    const eventSource = new EventSource(this.url, { withCredentials: true });
    this.eventSource = eventSource;

    eventSource.addEventListener('open', () => this.handleOpen());
    eventSource.addEventListener('error', () => this.handleError(eventSource));

    this.listeners.forEach((_eventListeners, eventName) => {
      eventSource.addEventListener(eventName, this.dispatchEvent);
    });
  }

  private handleOpen(): void {
    this.reconnectsInARow = 0;
    this.setStatus(SseConnectionStatus.Open);
  }

  /**
   * @param eventSource the connection that failed, so a superseded one is ignored.
   */
  private async handleError(eventSource: EventSource): Promise<void> {
    if (eventSource !== this.eventSource) return;

    // While CONNECTING, the browser keeps retrying on its own.
    const hasBrowserGivenUp = eventSource.readyState === EventSource.CLOSED;

    if (!hasBrowserGivenUp) {
      this.setStatus(SseConnectionStatus.Reconnecting);
      return;
    }

    if (this.reconnectsInARow >= MAX_RECONNECTS_IN_A_ROW) {
      this.disconnect();
      return;
    }

    this.reconnectsInARow += 1;
    this.setStatus(SseConnectionStatus.Reconnecting);

    const isRefreshed = await this.refreshSession();

    // `connect()` or `disconnect()` was called while refreshing.
    if (eventSource !== this.eventSource) return;

    if (!isRefreshed) {
      this.disconnect();
      return;
    }

    this.createNewEventSource();
  }

  private readonly dispatchEvent = (event: Event) => {
    const eventListeners = this.listeners.get(event.type);

    eventListeners?.forEach((listener) => {
      try {
        listener(event as MessageEvent);
      } catch (error) {
        console.error(error);
      }
    });
  };

  private unsubscribe(props: SubscribeProps): void {
    const { eventName, listener } = props;

    const eventListeners = this.listeners.get(eventName);

    eventListeners?.delete(listener);

    if (eventListeners?.size) return;

    this.listeners.delete(eventName);
    this.eventSource?.removeEventListener(eventName, this.dispatchEvent);
  }
}
