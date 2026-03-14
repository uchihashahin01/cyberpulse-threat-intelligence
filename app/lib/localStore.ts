export const ACCOUNT_KEY = 'cyberpulse.account';
export const BOOKMARKS_KEY = 'cyberpulse.bookmarks.byUser';
export const ALERTS_KEY = 'cyberpulse.alerts';
export const ADMIN_KEY = 'cyberpulse.admin';

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
