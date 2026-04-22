import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { type Route, getCurrentRoute, navigate, onRouteChange } from '../router.js';
import { t, onLocaleChange } from '../i18n.js';
import './views/gzg-dashboard.js';
import './views/gzg-deals.js';
import './views/gzg-submissions.js';
import './views/gzg-people.js';
import './views/gzg-ibans.js';
import './views/gzg-settings.js';

@customElement('gzg-app')
export class GzgApp extends LitElement {
  static styles = css`
    :host {
      display: flex;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }

    /* ---------- Sidebar ---------- */
    nav {
      width: 240px;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      padding: 0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      box-shadow: 2px 0 8px rgb(0 0 0 / 0.15);
    }

    .nav-header {
      padding: 1.25rem 1.25rem 1rem;
      border-bottom: 1px solid #334155;
    }

    .nav-header h1 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: #f8fafc;
      letter-spacing: -0.01em;
    }

    .nav-header p {
      margin: 0.25rem 0 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0;
      flex: 1;
    }

    nav a {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.625rem 1.25rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
      border-left: 3px solid transparent;
    }

    nav a:hover {
      background: rgb(255 255 255 / 0.05);
      color: #e2e8f0;
    }

    nav a[aria-current='page'] {
      background: rgb(255 255 255 / 0.08);
      color: #fff;
      border-left-color: #3b82f6;
    }

    nav a .icon {
      font-size: 1.125rem;
      width: 1.5rem;
      text-align: center;
    }

    /* ---------- Main ---------- */
    main {
      flex: 1;
      padding: 2rem 2.5rem;
      background: #f8fafc;
      overflow-y: auto;
    }
  `;

  @state() private _route: Route = getCurrentRoute();

  private _cleanupRoute?: () => void;
  private _cleanupLocale?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._cleanupRoute = onRouteChange((r) => (this._route = r));
    this._cleanupLocale = onLocaleChange(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupRoute?.();
    this._cleanupLocale?.();
  }

  private _nav(route: Route, e: Event) {
    e.preventDefault();
    navigate(route);
  }

  private _renderView() {
    switch (this._route) {
      case 'deals':
        return html`<gzg-deals></gzg-deals>`;
      case 'submissions':
        return html`<gzg-submissions></gzg-submissions>`;
      case 'people':
        return html`<gzg-people></gzg-people>`;
      case 'ibans':
        return html`<gzg-ibans></gzg-ibans>`;
      case 'settings':
        return html`<gzg-settings></gzg-settings>`;
      default:
        return html`<gzg-dashboard></gzg-dashboard>`;
    }
  }

  render() {
    const links: { route: Route; key: string; icon: string }[] = [
      { route: 'dashboard', key: 'nav.dashboard', icon: '📊' },
      { route: 'deals', key: 'nav.deals', icon: '🏷️' },
      { route: 'submissions', key: 'nav.submissions', icon: '📬' },
      { route: 'people', key: 'nav.people', icon: '👤' },
      { route: 'ibans', key: 'nav.ibans', icon: '🏦' },
      { route: 'settings', key: 'nav.settings', icon: '⚙️' },
    ];

    return html`
      <nav>
        <div class="nav-header">
          <h1>${t('app.title')}</h1>
          <p>Cashback Manager</p>
        </div>
        <div class="nav-links">
          ${links.map(
            (l) => html`
              <a
                href="#/${l.route}"
                aria-current=${this._route === l.route ? 'page' : 'false'}
                @click=${(e: Event) => this._nav(l.route, e)}
              ><span class="icon">${l.icon}</span>${t(l.key)}</a>
            `,
          )}
        </div>
      </nav>
      <main>${this._renderView()}</main>
    `;
  }
}
