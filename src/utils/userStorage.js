// Per-user namespaced localStorage access.
// Every user-specific key is suffixed with the active user's id (set at
// login/register, cleared at logout), so data cached while User A was signed
// in can never be read while User B is signed in — or by a brand-new user.
const CURRENT_USER_KEY = 'studyverse_current_user';

export const setCurrentUser = (userId) => {
  if (userId) localStorage.setItem(CURRENT_USER_KEY, String(userId));
};

export const clearCurrentUser = () => localStorage.removeItem(CURRENT_USER_KEY);

export const getCurrentUser = () => localStorage.getItem(CURRENT_USER_KEY);

/** Storage key for the active user (falls back to 'anon' before login). */
export const userKey = (base) => `${base}::${getCurrentUser() || 'anon'}`;

export const userGet = (base) => localStorage.getItem(userKey(base));

export const userSet = (base, value) =>
  localStorage.setItem(userKey(base), typeof value === 'string' ? value : JSON.stringify(value));

export const userRemove = (base) => localStorage.removeItem(userKey(base));
