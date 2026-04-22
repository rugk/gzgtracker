import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, onLocaleChange } from '../../i18n.js';
import { sharedStyles } from '../../shared-styles.js';
import { submissionStore, dealStore, peopleStore, ibanStore } from '../../store.js';
import type { Submission, SubmissionStatus, Deal, Person, Iban } from '../../models.js';

const STATUSES: SubmissionStatus[] = ['pending', 'submitted', 'approved', 'rejected', 'paid'];

@customElement('gzg-submissions')
export class GzgSubmissions extends LitElement {
  static styles = [sharedStyles];

  @state() private _items: Submission[] = [];
  @state() private _deals: Deal[] = [];
  @state() private _people: Person[] = [];
  @state() private _ibans: Iban[] = [];
  @state() private _showForm = false;
  @state() private _editId: string | null = null;
  @state() private _dealId = '';
  @state() private _personId = '';
  @state() private _ibanId = '';
  @state() private _amount = 0;
  @state() private _status: SubmissionStatus = 'pending';
  @state() private _submittedAt = '';
  @state() private _notes = '';

  private _cleanups: (() => void)[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._cleanups.push(
      onLocaleChange(() => this.requestUpdate()),
      submissionStore.onChange(() => this._load()),
      dealStore.onChange(() => this._loadRefs()),
      peopleStore.onChange(() => this._loadRefs()),
      ibanStore.onChange(() => this._loadRefs()),
    );
    this._load();
    this._loadRefs();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanups.forEach((fn) => fn());
    this._cleanups = [];
  }

  private async _load() {
    this._items = await submissionStore.getAll();
  }

  private async _loadRefs() {
    this._deals = await dealStore.getAll();
    this._people = await peopleStore.getAll();
    this._ibans = await ibanStore.getAll();
  }

  private _resetForm() {
    this._showForm = false;
    this._editId = null;
    this._dealId = '';
    this._personId = '';
    this._ibanId = '';
    this._amount = 0;
    this._status = 'pending';
    this._submittedAt = '';
    this._notes = '';
  }

  private _openCreate() {
    this._resetForm();
    this._showForm = true;
  }

  private _openEdit(s: Submission) {
    this._editId = s.id;
    this._dealId = s.dealId;
    this._personId = s.personId;
    this._ibanId = s.ibanId;
    this._amount = s.amount;
    this._status = s.status;
    this._submittedAt = s.submittedAt;
    this._notes = s.notes;
    this._showForm = true;
  }

  private async _save() {
    if (!this._dealId || !this._personId) return;
    const data = {
      dealId: this._dealId,
      personId: this._personId,
      ibanId: this._ibanId,
      amount: this._amount,
      status: this._status,
      submittedAt: this._submittedAt,
      notes: this._notes.trim(),
    };
    if (this._editId) {
      await submissionStore.update(this._editId, data);
    } else {
      await submissionStore.create(data);
    }
    this._resetForm();
  }

  private async _delete(id: string) {
    await submissionStore.remove(id);
  }

  private _dealTitle(id: string): string {
    return this._deals.find((d) => d.id === id)?.title ?? '—';
  }

  private _personName(id: string): string {
    return this._people.find((p) => p.id === id)?.name ?? '—';
  }

  private _ibanLabel(id: string): string {
    const iban = this._ibans.find((i) => i.id === id);
    return iban ? (iban.label || iban.iban) : '—';
  }

  private _filteredIbans(): Iban[] {
    if (!this._personId) return this._ibans;
    return this._ibans.filter((i) => i.personId === this._personId);
  }

  render() {
    return html`
      <div class="toolbar">
        <h2>${t('submissions.title')}</h2>
        <button class="btn btn-primary" @click=${this._openCreate}>+ Add Submission</button>
      </div>

      ${this._showForm ? this._renderForm() : ''}

      ${this._items.length === 0 && !this._showForm
        ? html`<p class="empty">${t('submissions.empty')}</p>`
        : ''}

      ${this._items.length > 0 ? html`
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Person</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this._items.map((s) => html`
                <tr>
                  <td>${this._dealTitle(s.dealId)}</td>
                  <td>${this._personName(s.personId)}</td>
                  <td>${s.amount ? `€${s.amount.toFixed(2)}` : html`<span class="text-muted">—</span>`}</td>
                  <td><span class="badge badge-${s.status}">${s.status}</span></td>
                  <td class="text-sm text-muted">${s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-secondary btn-sm" @click=${() => this._openEdit(s)}>Edit</button>
                      <button class="btn btn-danger btn-sm" @click=${() => this._delete(s.id)}>Delete</button>
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
          ${this._editId ? 'Edit Submission' : 'New Submission'}
        </h3>
        <div class="form-row">
          <div class="form-group">
            <label>Deal *</label>
            <select .value=${this._dealId}
              @change=${(e: Event) => this._dealId = (e.target as HTMLSelectElement).value}>
              <option value="">— Select deal —</option>
              ${this._deals.map((d) => html`
                <option value=${d.id} ?selected=${this._dealId === d.id}>${d.title}</option>
              `)}
            </select>
          </div>
          <div class="form-group">
            <label>Person *</label>
            <select .value=${this._personId}
              @change=${(e: Event) => { this._personId = (e.target as HTMLSelectElement).value; this._ibanId = ''; }}>
              <option value="">— Select person —</option>
              ${this._people.map((p) => html`
                <option value=${p.id} ?selected=${this._personId === p.id}>${p.name}</option>
              `)}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>IBAN</label>
            <select .value=${this._ibanId}
              @change=${(e: Event) => this._ibanId = (e.target as HTMLSelectElement).value}>
              <option value="">— Select IBAN —</option>
              ${this._filteredIbans().map((i) => html`
                <option value=${i.id} ?selected=${this._ibanId === i.id}>${i.label || i.iban}</option>
              `)}
            </select>
          </div>
          <div class="form-group">
            <label>Amount (€)</label>
            <input type="number" step="0.01" min="0" .value=${String(this._amount)}
              @input=${(e: Event) => this._amount = parseFloat((e.target as HTMLInputElement).value) || 0} />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select .value=${this._status}
              @change=${(e: Event) => this._status = (e.target as HTMLSelectElement).value as SubmissionStatus}>
              ${STATUSES.map((s) => html`
                <option value=${s} ?selected=${this._status === s}>${s}</option>
              `)}
            </select>
          </div>
          <div class="form-group">
            <label>Submitted At</label>
            <input type="date" .value=${this._submittedAt}
              @input=${(e: Event) => this._submittedAt = (e.target as HTMLInputElement).value} />
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
