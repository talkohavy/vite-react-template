import { uuid } from '@src/common/utils/uuid';
import { SESSION_KEYS } from './constants';

class SessionManager {
  constructor() {
    const localStorageId = localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE);
    const sessionStorageId = sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE);

    if (!localStorageId) {
      localStorage.setItem(SESSION_KEYS.LOCAL_STORAGE, uuid());
    }

    if (!sessionStorageId) {
      sessionStorage.setItem(SESSION_KEYS.SESSION_STORAGE, uuid());
    }
  }

  setTabId() {
    const sessionStorageId = sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE);

    if (!sessionStorageId) {
      sessionStorage.setItem(SESSION_KEYS.SESSION_STORAGE, uuid());
    }
  }

  setBrowserId() {
    const localStorageId = localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE);

    if (!localStorageId) {
      localStorage.setItem(SESSION_KEYS.LOCAL_STORAGE, uuid());
    }
  }

  getTabId() {
    const sessionStorageId = sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE);

    return sessionStorageId;
  }

  getBrowserId() {
    const localStorageId = localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE);

    return localStorageId;
  }

  getSessionIds() {
    const localStorageId = this.getBrowserId();
    const sessionStorageId = this.getTabId();

    return { localStorageId, sessionStorageId };
  }
}

export let sessionManager = null as unknown as SessionManager;

export function initSessionManager() {
  sessionManager = new SessionManager();
}
