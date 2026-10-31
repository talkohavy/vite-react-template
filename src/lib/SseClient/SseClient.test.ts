import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vite-plus/test';
import { SseConnectionStatus } from './logic/constants';
import { SseClient } from './SseClient';

type Listener = (event: Event) => void;

/**
 * jsdom has no `EventSource`. This one lets the test play the browser's part.
 */
class FakeEventSource {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;
  static instances: Array<FakeEventSource> = [];

  readyState = FakeEventSource.CONNECTING;
  private readonly listeners = new Map<string, Set<Listener>>();

  constructor(
    readonly url: string,
    readonly init?: EventSourceInit,
  ) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(eventName: string, listener: Listener) {
    const eventListeners = this.listeners.get(eventName) ?? new Set<Listener>();

    eventListeners.add(listener);
    this.listeners.set(eventName, eventListeners);
  }

  removeEventListener(eventName: string, listener: Listener) {
    this.listeners.get(eventName)?.delete(listener);
  }

  close() {
    this.readyState = FakeEventSource.CLOSED;
  }

  emit(eventName: string, data = '{}') {
    const event = new MessageEvent(eventName, { data });

    this.listeners.get(eventName)?.forEach((listener) => listener(event));
  }

  open() {
    this.readyState = FakeEventSource.OPEN;
    this.listeners.get('open')?.forEach((listener) => listener(new Event('open')));
  }

  /**
   * What the browser does when a reconnect gets a non-200 answer, e.g. a 401 once the access token expired.
   */
  giveUp() {
    this.readyState = FakeEventSource.CLOSED;
    this.listeners.get('error')?.forEach((listener) => listener(new Event('error')));
  }

  /**
   * What the browser does when the connection drops: it reconnects on its own.
   */
  dropConnection() {
    this.readyState = FakeEventSource.CONNECTING;
    this.listeners.get('error')?.forEach((listener) => listener(new Event('error')));
  }
}

describe('SseClient', () => {
  const url = 'http://api.test/api/sse';

  let refreshSession: Mock<() => Promise<boolean>>;
  let onStatusChange: Mock<(status: string) => void>;
  let listener: Mock<(event: MessageEvent) => void>;
  let sseClient: SseClient;

  function getLatestEventSource(): FakeEventSource {
    const latestEventSource = FakeEventSource.instances.at(-1)!;

    return latestEventSource;
  }

  /**
   * The client awaited the same promise first, so it has moved on by the time this resolves.
   */
  async function waitForRefreshToSettle() {
    await refreshSession.mock.results.at(-1)?.value;
  }

  async function giveUpAndWaitForRefresh() {
    getLatestEventSource().giveUp();
    await waitForRefreshToSettle();
  }

  beforeEach(() => {
    FakeEventSource.instances = [];
    vi.stubGlobal('EventSource', FakeEventSource);

    refreshSession = vi.fn().mockResolvedValue(true);
    onStatusChange = vi.fn();
    listener = vi.fn();
    sseClient = new SseClient({ url, refreshSession, onStatusChange });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('connect', () => {
    it('should connect with cookies', () => {
      const expectedResult = { url, init: { withCredentials: true } };

      sseClient.connect();

      const { url: actualUrl, init } = getLatestEventSource();
      const actualResult = { url: actualUrl, init };
      expect(actualResult).toEqual(expectedResult);
    });

    it('should report connecting, then open', () => {
      const expectedResult = [[SseConnectionStatus.Connecting], [SseConnectionStatus.Open]];

      sseClient.connect();
      getLatestEventSource().open();

      const actualResult = onStatusChange.mock.calls;
      expect(actualResult).toEqual(expectedResult);
    });

    it('should close the previous connection', () => {
      sseClient.connect();
      const previousEventSource = getLatestEventSource();

      sseClient.connect();

      expect(previousEventSource.readyState).toBe(FakeEventSource.CLOSED);
    });
  });

  describe('subscribe', () => {
    it('should pass events of that name to the listener', () => {
      sseClient.connect();
      sseClient.subscribe({ eventName: 'message', listener });

      getLatestEventSource().emit('message', '{"time":"now"}');

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ data: '{"time":"now"}' }));
    });

    it('should not pass events of other names', () => {
      sseClient.connect();
      sseClient.subscribe({ eventName: 'message', listener });

      getLatestEventSource().emit('connected');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should work when made before connecting', () => {
      sseClient.subscribe({ eventName: 'message', listener });
      sseClient.connect();

      getLatestEventSource().emit('message');

      expect(listener).toHaveBeenCalledOnce();
    });

    it('should stop passing events once unsubscribed', () => {
      sseClient.connect();
      const unsubscribe = sseClient.subscribe({ eventName: 'message', listener });

      unsubscribe();
      getLatestEventSource().emit('message');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should keep calling other listeners when one throws', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      sseClient.connect();
      sseClient.subscribe({
        eventName: 'message',
        listener: () => {
          throw new Error('listener failed');
        },
      });
      sseClient.subscribe({ eventName: 'message', listener });

      getLatestEventSource().emit('message');

      expect(listener).toHaveBeenCalledOnce();
    });
  });

  describe('when the browser gives up on reconnecting', () => {
    beforeEach(() => {
      sseClient.subscribe({ eventName: 'message', listener });
      sseClient.connect();
    });

    it('should refresh the session', async () => {
      await giveUpAndWaitForRefresh();

      expect(refreshSession).toHaveBeenCalledOnce();
    });

    it('should open a new connection once the session is refreshed', async () => {
      await giveUpAndWaitForRefresh();

      expect(FakeEventSource.instances).toHaveLength(2);
    });

    it('should keep the subscriptions on the new connection', async () => {
      await giveUpAndWaitForRefresh();

      getLatestEventSource().emit('message');

      expect(listener).toHaveBeenCalledOnce();
    });

    it('should close for good when the session cannot be refreshed', async () => {
      refreshSession.mockResolvedValue(false);

      await giveUpAndWaitForRefresh();

      expect(sseClient.getStatus()).toBe(SseConnectionStatus.Closed);
    });

    it('should not open a new connection when the session cannot be refreshed', async () => {
      refreshSession.mockResolvedValue(false);

      await giveUpAndWaitForRefresh();

      expect(FakeEventSource.instances).toHaveLength(1);
    });

    it('should stop after 3 reconnects in a row that never opened', async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        await giveUpAndWaitForRefresh();
      }

      expect(FakeEventSource.instances).toHaveLength(4);
    });

    it('should start counting again after a connection opens', async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await giveUpAndWaitForRefresh();
      }
      getLatestEventSource().open();

      await giveUpAndWaitForRefresh();

      expect(FakeEventSource.instances).toHaveLength(5);
    });

    it('should not reconnect when disconnected during the refresh', async () => {
      getLatestEventSource().giveUp();
      sseClient.disconnect();
      await waitForRefreshToSettle();

      expect(FakeEventSource.instances).toHaveLength(1);
    });

    it('should not open a second connection when connect() was called during the refresh', async () => {
      getLatestEventSource().giveUp();
      sseClient.connect();
      await waitForRefreshToSettle();

      expect(FakeEventSource.instances).toHaveLength(2);
    });
  });

  describe('when the connection drops and the browser is still reconnecting', () => {
    beforeEach(() => {
      sseClient.connect();
      getLatestEventSource().open();
    });

    it('should leave it to the browser', () => {
      getLatestEventSource().dropConnection();

      expect(refreshSession).not.toHaveBeenCalled();
    });

    it('should report reconnecting', () => {
      getLatestEventSource().dropConnection();

      expect(sseClient.getStatus()).toBe(SseConnectionStatus.Reconnecting);
    });
  });

  describe('disconnect', () => {
    it('should close the connection', () => {
      sseClient.connect();

      sseClient.disconnect();

      expect(getLatestEventSource().readyState).toBe(FakeEventSource.CLOSED);
    });

    it('should report closed', () => {
      sseClient.connect();

      sseClient.disconnect();

      expect(sseClient.getStatus()).toBe(SseConnectionStatus.Closed);
    });

    it('should stay idle when it never connected', () => {
      sseClient.disconnect();

      expect(sseClient.getStatus()).toBe(SseConnectionStatus.Idle);
    });
  });
});
