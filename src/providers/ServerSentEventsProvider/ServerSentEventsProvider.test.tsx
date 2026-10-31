import type { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { SseConnectionStatus } from '@src/lib/SseClient';
import { useServerSentEvents } from './ServerSentEventsContext';
import ServerSentEventsProvider from './ServerSentEventsProvider';

vi.mock('@src/lib/HttpClient', () => ({ httpClient: { refreshSession: vi.fn() } }));

type Listener = (event: Event) => void;

class FakeEventSource {
  static readonly CLOSED = 2;
  static latest: FakeEventSource | null = null;

  readyState = 0;
  private readonly listeners = new Map<string, Set<Listener>>();

  constructor() {
    FakeEventSource.latest = this;
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

  emit(eventName: string, event: Event) {
    this.listeners.get(eventName)?.forEach((listener) => listener(event));
  }
}

function Wrapper(props: PropsWithChildren) {
  const { children } = props;

  return <ServerSentEventsProvider>{children}</ServerSentEventsProvider>;
}

describe('ServerSentEventsProvider', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', FakeEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should pass JSON-parsed event data to subscribers', () => {
    const expectedResult = { time: '2026-10-30T10:00:00.000Z' };
    const listener = vi.fn();
    const { result } = renderHook(useServerSentEvents, { wrapper: Wrapper });
    act(() => {
      result.current.subscribe({ eventName: 'message', listener });
      result.current.connect();
    });

    FakeEventSource.latest!.emit('message', new MessageEvent('message', { data: JSON.stringify(expectedResult) }));

    const actualResult = listener.mock.calls[0]![0];
    expect(actualResult).toEqual(expectedResult);
  });

  it('should pass non-JSON data as is', () => {
    const listener = vi.fn();
    const { result } = renderHook(useServerSentEvents, { wrapper: Wrapper });
    act(() => {
      result.current.subscribe({ eventName: 'message', listener });
      result.current.connect();
    });

    FakeEventSource.latest!.emit('message', new MessageEvent('message', { data: 'plain text' }));

    expect(listener).toHaveBeenCalledWith('plain text');
  });

  it('should expose the connection status', () => {
    const { result } = renderHook(useServerSentEvents, { wrapper: Wrapper });

    act(() => {
      result.current.connect();
      FakeEventSource.latest!.emit('open', new Event('open'));
    });

    expect(result.current.connectionStatus).toBe(SseConnectionStatus.Open);
  });

  it('should call status subscribers on every status change', () => {
    const expectedResult = [[SseConnectionStatus.Connecting], [SseConnectionStatus.Open]];
    const listener = vi.fn();
    const { result } = renderHook(useServerSentEvents, { wrapper: Wrapper });

    act(() => {
      result.current.subscribeToStatus(listener);
      result.current.connect();
      FakeEventSource.latest!.emit('open', new Event('open'));
    });

    const actualResult = listener.mock.calls;
    expect(actualResult).toEqual(expectedResult);
  });

  it('should stop calling a status subscriber once unsubscribed', () => {
    const listener = vi.fn();
    const { result } = renderHook(useServerSentEvents, { wrapper: Wrapper });

    act(() => {
      const unsubscribe = result.current.subscribeToStatus(listener);
      unsubscribe();
      result.current.connect();
    });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should throw when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    function renderOutsideProvider() {
      renderHook(useServerSentEvents);
    }

    expect(renderOutsideProvider).toThrow('useServerSentEvents must be used within ServerSentEventsProvider');
  });
});
