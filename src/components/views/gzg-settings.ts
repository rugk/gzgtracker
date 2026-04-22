import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, getLocale, setLocale, onLocaleChange } from '../../i18n.js';
import { sharedStyles } from '../../shared-styles.js';

@customElement('gzg-settings')
export class GzgSettings extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .settings-section {
        max-width: 480px;
      }
    `,
  ];

  @state() private _locale = getLocale();

  private _cleanup?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._cleanup = onLocaleChange(() => {
      this._locale = getLocale();
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup?.();
  }

  private _onLangChange(e: Event) {
    setLocale((e.target as HTMLSelectElement).value as 'en' | 'de');
  }

  render() {
    return html`
      <h2>${t('settings.title')}</h2>
      <div class="card settings-section">
        <div class="form-group">
          <label>${t('settings.language')}</label>
          <select @change=${this._onLangChange}>
            <option value="en" ?selected=${this._locale === 'en'}>English</option>
            <option value="de" ?selected=${this._locale === 'de'}>Deutsch</option>
          </select>
        </div>
      </div>
    `;
  }
}
