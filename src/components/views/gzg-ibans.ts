import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, onLocaleChange } from '../../i18n.js';
import { sharedStyles } from '../../shared-styles.js';
import { ibanStore, peopleStore } from '../../store.js';
import type { Iban, Person } from '../../models.js';

@customElement('gzg-ibans')
export class GzgIbans extends LitElement {
  static styles = [sharedStyles];

  @state() private _items: Iban[] = [];
  @state() private _people: Person[] = [];
  @state() private _showForm = false;
  @state() private _editId: string | null = null;
  @state() private _label = '';
  @state() private _iban = '';
  @state() private _personId = '';

  private _cleanupLocale?: () => void;
  private _cleanupStore?: () => void;
  private _cleanupPeople?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._cleanupLocale = onLocaleChange(() => this.requestUpdate());
    this._cleanupStore = ibanStore.onChange(() => this._load());
    this._cleanupPeople = peopleStore.onChange(() => this._loadPeople());
    this._load();
    this._loadPeople();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupLocale?.();
    this._cleanupStore?.();
    this._cleanupPeople?.();
  }

  private async _load() {
    this._items = await ibanStore.getAll();
  }

  private async _loadPeople() {
    this._people = await peopleStore.getAll();
  }

  private _resetForm() {
    this._showForm = false;
    this._editId = null;
    this._label = '';
    this._iban = '';
    this._personId = '';
  }

  private _openCreate() {
    this._resetForm();
    this._showForm = true;
  }

  private _openEdit(item: Iban) {
    this._editId = item.id;
    this._label = item.label;
    this._iban = item.iban;
    this._personId = item.personId;
    this._showForm = true;
  }

  private async _save() {
    if (!this._iban.trim() || !this._personId) return;
    const data = { label: this._label.trim(), iban: this._iban.trim(), personId: this._personId };
    if (this._editId) {
      await ibanStore.update(this._editId, data);
    } else {
      await ibanStore.create(data);
    }
    this._resetForm();
  }

  private async _delete(id: string) {
    await ibanStore.remove(id);
  }

  private _personName(id: string): string {
    return this._people.find((p) => p.id === id)?.name ?? '—';
  }

  render() {
    return html`
      <div class="toolbar">
        <h2>${t('ibans.title')}</h2>
        <button class="btn btn-primary" @click=${this._openCreate}>+ Add IBAN</button>
      </div>

      ${this._showForm ? this._renderForm() : ''}

      ${this._items.length === 0 && !this._showForm
        ? html`<p class="empty">${t('ibans.empty')}</p>`
        : ''}

      ${this._items.length > 0 ? html`
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>IBAN</th>
                <th>Person</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this._items.map((item) => html`
                <tr>
                  <td>${item.label || html`<span class="text-muted">—</span>`}</td>
                  <td style="font-family:monospace;font-size:0.8125rem;">${item.iban}</td>
                  <td>${this._personName(item.personId)}</td>
                  <td class="text-sm text-muted">${new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" @click=${() => this._openEdit(item)}>Edit</button>
                      <button class="btn btn-danger btn-sm" @click=${() => this._delete(item.id)}>Delete</button>
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
          ${this._editId ? 'Edit IBAN' : 'New IBAN'}
        </h3>
        <div class="form-row">
          <div class="form-group">
            <label>IBAN *</label>
            <input type="text" .value=${this._iban}
              @input=${(e: Event) => this._iban = (e.target as HTMLInputElement).value}
              placeholder="DE89 3704 0044 0532 0130 00" />
          </div>
          <div class="form-group">
            <label>Label</label>
            <input type="text" .value=${this._label}
              @input=${(e: Event) => this._label = (e.target as HTMLInputElement).value}
              placeholder="e.g. Main account" />
          </div>
        </div>
        <div class="form-group">
          <label>Person *</label>
          <select .value=${this._personId}
            @change=${(e: Event) => this._personId = (e.target as HTMLSelectElement).value}>
            <option value="">— Select person —</option>
            ${this._people.map((p) => html`
              <option value=${p.id} ?selected=${this._personId === p.id}>${p.name}</option>
            `)}
          </select>
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
