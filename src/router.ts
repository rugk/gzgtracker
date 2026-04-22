export type Route = 'dashboard' | 'deals' | 'submissions' | 'people' | 'ibans' | 'settings';

const VALID_ROUTES: Route[] = ['dashboard', 'deals', 'submissions', 'people', 'ibans', 'settings'];

export function getCurrentRoute(): Route {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (VALID_ROUTES.includes(hash as Route)) {
    return hash as Route;
  }
  return 'dashboard';
}

export function navigate(route: Route): void {
  window.location.hash = `#/${route}`;
}

export function onRouteChange(callback: (route: Route) => void): () => void {
  const handler = () => callback(getCurrentRoute());
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}
