import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, getLocale, setLocale, onLocaleChange } from '../../i18n.js';

@customElement('gzg-settings')
export class GzgSettings extends LitElement {
  static styles = css`
    h2 { margin-top: 0; }
    label { font-weight: 600; margin-right: 0.5rem; }
    select { padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; }
  `;

  @state() private _locale = getLocale();

  private _cleanup?: () => void;
  connectedCallback() {
    super.connectedCallback();
    this._cleanup = onLocaleChange(() => {
      this._locale = getLocale();
    });
  }
  disconnectedCallback() { super.disconnectedCallback(); this._cleanup?.(); }

  private _onLangChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    if (val === 'en' || val === 'de') setLocale(val);
  }

  render() {
    return html`
      <h2>${t('settings.title')}</h2>
      <label>${t('settings.language')}</label>
      <select @change=${this._onLangChange}>
        <option value="en" ?selected=${this._locale === 'en'}>English</option>
        <option value="de" ?selected=${this._locale === 'de'}>Deutsch</option>
      </select>
    `;
  }
}
