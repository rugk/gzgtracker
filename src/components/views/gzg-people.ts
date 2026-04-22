import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, onLocaleChange } from '../../i18n.js';
import { sharedStyles } from '../../shared-styles.js';
import { peopleStore } from '../../store.js';
import type { Person } from '../../models.js';

@customElement('gzg-people')
export class GzgPeople extends LitElement {
  static styles = [sharedStyles];

  @state() private _items: Person[] = [];
  @state() private _showForm = false;
  @state() private _editId: string | null = null;
  @state() private _name = '';
  @state() private _email = '';

  private _cleanupLocale?: () => void;
  private _cleanupStore?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._cleanupLocale = onLocaleChange(() => this.requestUpdate());
    this._cleanupStore = peopleStore.onChange(() => this._load());
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupLocale?.();
    this._cleanupStore?.();
  }

  private async _load() {
    this._items = await peopleStore.getAll();
  }

  private _resetForm() {
    this._showForm = false;
    this._editId = null;
    this._name = '';
    this._email = '';
  }

  private _openCreate() {
    this._resetForm();
    this._showForm = true;
  }

  private _openEdit(p: Person) {
    this._editId = p.id;
    this._name = p.name;
    this._email = p.email;
    this._showForm = true;
  }

  private async _save() {
    if (!this._name.trim()) return;
    if (this._editId) {
      await peopleStore.update(this._editId, { name: this._name.trim(), email: this._email.trim() });
    } else {
      await peopleStore.create({ name: this._name.trim(), email: this._email.trim() });
    }
    this._resetForm();
  }

  private async _delete(id: string) {
    await peopleStore.remove(id);
  }

  render() {
    return html`
      <div class="toolbar">
        <h2>${t('people.title')}</h2>
        <button class="btn btn-primary" @click=${this._openCreate}>+ Add Person</button>
      </div>

      ${this._showForm ? this._renderForm() : ''}

      ${this._items.length === 0 && !this._showForm
        ? html`<p class="empty">${t('people.empty')}</p>`
        : ''}

      ${this._items.length > 0 ? html`
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this._items.map((p) => html`
                <tr>
                  <td>${p.name}</td>
                  <td>${p.email || html`<span class="text-muted">—</span>`}</td>
                  <td class="text-sm text-muted">${new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" @click=${() => this._openEdit(p)}>Edit</button>
                      <button class="btn btn-danger btn-sm" @click=${() => this._delete(p.id)}>Delete</button>
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
          ${this._editId ? 'Edit Person' : 'New Person'}
        </h3>
        <div class="form-row">
          <div class="form-group">
            <label>Name *</label>
            <input type="text" .value=${this._name}
              @input=${(e: Event) => this._name = (e.target as HTMLInputElement).value}
              placeholder="Full name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" .value=${this._email}
              @input=${(e: Event) => this._email = (e.target as HTMLInputElement).value}
              placeholder="email@example.com" />
          </div>
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
