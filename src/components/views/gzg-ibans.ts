import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { t, onLocaleChange } from '../../i18n.js';

@customElement('gzg-ibans')
export class GzgIbans extends LitElement {
  static styles = css`h2 { margin-top: 0; } p { color: #64748b; }`;
  private _cleanup?: () => void;
  connectedCallback() { super.connectedCallback(); this._cleanup = onLocaleChange(() => this.requestUpdate()); }
  disconnectedCallback() { super.disconnectedCallback(); this._cleanup?.(); }
  render() { return html`<h2>${t('ibans.title')}</h2><p>${t('ibans.empty')}</p>`; }
}
