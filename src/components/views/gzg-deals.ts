import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, onLocaleChange } from '../../i18n.js';
import { sharedStyles } from '../../shared-styles.js';
import { dealStore } from '../../store.js';
import type { Deal } from '../../models.js';

@customElement('gzg-deals')
export class GzgDeals extends LitElement {
  static styles = [sharedStyles];

  @state() private _items: Deal[] = [];
  @state() private _showForm = false;
  @state() private _editId: string | null = null;
  @state() private _title = '';
  @state() private _brand = '';
  @state() private _maxCashback = 0;
  @state() private _startDate = '';
  @state() private _endDate = '';
  @state() private _url = '';
  @state() private _notes = '';

  private _cleanupLocale?: () => void;
  private _cleanupStore?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._cleanupLocale = onLocaleChange(() => this.requestUpdate());
    this._cleanupStore = dealStore.onChange(() => this._load());
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupLocale?.();
    this._cleanupStore?.();
  }

  private async _load() {
    this._items = await dealStore.getAll();
  }

  private _resetForm() {
    this._showForm = false;
    this._editId = null;
    this._title = '';
    this._brand = '';
    this._maxCashback = 0;
    this._startDate = '';
    this._endDate = '';
    this._url = '';
    this._notes = '';
  }

  private _openCreate() {
    this._resetForm();
    this._showForm = true;
  }

  private _openEdit(d: Deal) {
    this._editId = d.id;
    this._title = d.title;
    this._brand = d.brand;
    this._maxCashback = d.maxCashback;
    this._startDate = d.startDate;
    this._endDate = d.endDate;
    this._url = d.url;
    this._notes = d.notes;
    this._showForm = true;
  }

  private async _save() {
    if (!this._title.trim()) return;
    const data = {
      title: this._title.trim(),
      brand: this._brand.trim(),
      maxCashback: this._maxCashback,
      startDate: this._startDate,
      endDate: this._endDate,
      url: this._url.trim(),
      notes: this._notes.trim(),
    };
    if (this._editId) {
      await dealStore.update(this._editId, data);
    } else {
      await dealStore.create(data);
    }
    this._resetForm();
  }

  private async _delete(id: string) {
    await dealStore.remove(id);
  }

  private _isActive(d: Deal): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return (!d.startDate || d.startDate <= today) && (!d.endDate || d.endDate >= today);
  }

  render() {
    return html`
      <div class="toolbar">
        <h2>${t('deals.title')}</h2>
        <button class="btn btn-primary" @click=${this._openCreate}>+ Add Deal</button>
      </div>

      ${this._showForm ? this._renderForm() : ''}

      ${this._items.length === 0 && !this._showForm
        ? html`<p class="empty">${t('deals.empty')}</p>`
        : ''}

      ${this._items.length > 0 ? html`
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Brand</th>
                <th>Max €</th>
                <th>Period</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this._items.map((d) => html`
                <tr>
                  <td>
                    ${d.url
                      ? html`<a href=${d.url} target="_blank" rel="noopener"
                          style="color:#2563eb;text-decoration:none;">${d.title}</a>`
                      : d.title}
                  </td>
                  <td>${d.brand || html`<span class="text-muted">—</span>`}</td>
                  <td>${d.maxCashback ? `€${d.maxCashback.toFixed(2)}` : html`<span class="text-muted">—</span>`}</td>
                  <td class="text-sm">
                    ${d.startDate || '…'} → ${d.endDate || '…'}
                  </td>
                  <td>
                    <span class="badge ${this._isActive(d) ? 'badge-approved' : 'badge-rejected'}">
                      ${this._isActive(d) ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" @click=${() => this._openEdit(d)}>Edit</button>
                      <button class="btn btn-danger btn-sm" @click=${() => this._delete(d.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      ` : ''}
    `;
  }

  private _renderForm() {
    return html`
      <div class="card mb-4">
        <h3 style="margin:0 0 1rem;font-size:1.1rem;font-weight:600;">
          ${this._editId ? 'Edit Deal' : 'New Deal'}
        </h3>
        <div class="form-row">
          <div class="form-group">
            <label>Title *</label>
            <input type="text" .value=${this._title}
              @input=${(e: Event) => this._title = (e.target as HTMLInputElement).value}
              placeholder="e.g. Barilla Pasta GzG" />
          </div>
          <div class="form-group">
            <label>Brand</label>
            <input type="text" .value=${this._brand}
              @input=${(e: Event) => this._brand = (e.target as HTMLInputElement).value}
              placeholder="e.g. Barilla" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Max Cashback (€)</label>
            <input type="number" step="0.01" min="0" .value=${String(this._maxCashback)}
              @input=${(e: Event) => this._maxCashback = parseFloat((e.target as HTMLInputElement).value) || 0} />
          </div>
          <div class="form-group">
            <label>URL</label>
            <input type="url" .value=${this._url}
              @input=${(e: Event) => this._url = (e.target as HTMLInputElement).value}
              placeholder="https://..." />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" .value=${this._startDate}
              @input=${(e: Event) => this._startDate = (e.target as HTMLInputElement).value} />
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" .value=${this._endDate}
              @input=${(e: Event) => this._endDate = (e.target as HTMLInputElement).value} />
          </div>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea .value=${this._notes}
            @input=${(e: Event) => this._notes = (e.target as HTMLTextAreaElement).value}
            placeholder="Additional notes…"></textarea>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" @click=${this._save}>
            ${this._editId ? 'Update' : 'Create'}
          </button>
          <button class="btn btn-secondary" @click=${this._resetForm}>Cancel</button>
        </div>
      </div>
    `;
  }
}
