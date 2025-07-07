export function isAuthenticated() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authenticated') === 'true';
  }
  return false;
}