import { createContext, use } from 'react';
import type { ServerSentEventsContextValue } from './types';

const INITIAL_STATE = null;

export const ServerSentEventsContext = createContext<ServerSentEventsContextValue | null>(INITIAL_STATE);

export function useServerSentEvents(): ServerSentEventsContextValue {
  const ctx = use(ServerSentEventsContext);

  if (!ctx) {
    throw new Error('useServerSentEvents must be used within ServerSentEventsProvider');
  }

  return ctx;
}
