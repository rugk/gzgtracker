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
      font-family: system-ui, sans-serif;
    }
    nav {
      width: 220px;
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
    }
    nav h1 {
      font-size: 1.25rem;
      font-weight: 700;
      padding: 0 1rem 1rem;
      border-bottom: 1px solid #334155;
      margin: 0;
    }
    nav a {
      display: block;
      padding: 0.625rem 1rem;
      color: #cbd5e1;
      text-decoration: none;
      transition: background 0.15s;
    }
    nav a:hover,
    nav a[aria-current='page'] {
      background: #334155;
      color: #fff;
    }
    main {
      flex: 1;
      padding: 2rem;
      background: #f8fafc;
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
    const links: { route: Route; key: string }[] = [
      { route: 'dashboard', key: 'nav.dashboard' },
      { route: 'deals', key: 'nav.deals' },
      { route: 'submissions', key: 'nav.submissions' },
      { route: 'people', key: 'nav.people' },
      { route: 'ibans', key: 'nav.ibans' },
      { route: 'settings', key: 'nav.settings' },
    ];

    return html`
      <nav>
        <h1>${t('app.title')}</h1>
        ${links.map(
          (l) => html`
            <a
              href="#/${l.route}"
              aria-current=${this._route === l.route ? 'page' : 'false'}
              @click=${(e: Event) => this._nav(l.route, e)}
            >${t(l.key)}</a>
          `,
        )}
      </nav>
      <main>${this._renderView()}</main>
    `;
  }
}
