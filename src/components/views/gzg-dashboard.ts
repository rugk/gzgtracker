import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { t, onLocaleChange } from '../../i18n.js';
import { sharedStyles } from '../../shared-styles.js';
import { dealStore, submissionStore, peopleStore, ibanStore } from '../../store.js';
import type { Deal, Submission } from '../../models.js';

@customElement('gzg-dashboard')
export class GzgDashboard extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
      }
      .stat-card .label {
        font-size: 0.8125rem;
        color: #64748b;
        margin-bottom: 0.25rem;
      }
      .stat-card .value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #0f172a;
      }
      .recent-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.75rem;
        color: #0f172a;
      }
    `,
  ];

  @state() private _dealCount = 0;
  @state() private _submissionCount = 0;
  @state() private _peopleCount = 0;
  @state() private _ibanCount = 0;
  @state() private _totalCashback = 0;
  @state() private _pendingCount = 0;
  @state() private _recentSubmissions: Submission[] = [];
  @state() private _deals: Deal[] = [];

  private _cleanups: (() => void)[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._cleanups.push(
      onLocaleChange(() => this.requestUpdate()),
      dealStore.onChange(() => this._load()),
      submissionStore.onChange(() => this._load()),
      peopleStore.onChange(() => this._load()),
      ibanStore.onChange(() => this._load()),
    );
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanups.forEach((fn) => fn());
    this._cleanups = [];
  }

  private async _load() {
    const [deals, submissions, people, ibans] = await Promise.all([
      dealStore.getAll(),
      submissionStore.getAll(),
      peopleStore.getAll(),
      ibanStore.getAll(),
    ]);
    this._deals = deals;
    this._dealCount = deals.length;
    this._submissionCount = submissions.length;
    this._peopleCount = people.length;
    this._ibanCount = ibans.length;
    this._totalCashback = submissions
      .filter((s) => s.status === 'paid')
      .reduce((sum, s) => sum + s.amount, 0);
    this._pendingCount = submissions.filter((s) => s.status === 'pending' || s.status === 'submitted').length;
    this._recentSubmissions = submissions.slice(0, 5);
  }

  private _dealTitle(id: string): string {
    return this._deals.find((d) => d.id === id)?.title ?? '—';
  }

  render() {
    return html`
      <h2>${t('dashboard.welcome')}</h2>
      <p class="text-muted" style="margin-top:-1rem;margin-bottom:1.5rem;">${t('dashboard.description')}</p>

      <div class="stats">
        <div class="stat-card">
          <div class="label">Deals</div>
          <div class="value">${this._dealCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">Submissions</div>
          <div class="value">${this._submissionCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">Pending</div>
          <div class="value">${this._pendingCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">Cashback Received</div>
          <div class="value">€${this._totalCashback.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="label">People</div>
          <div class="value">${this._peopleCount}</div>
        </div>
        <div class="stat-card">
          <div class="label">IBANs</div>
          <div class="value">${this._ibanCount}</div>
        </div>
      </div>

      ${this._recentSubmissions.length > 0 ? html`
        <div class="card">
          <h3 class="recent-title">Recent Submissions</h3>
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${this._recentSubmissions.map((s) => html`
                <tr>
                  <td>${this._dealTitle(s.dealId)}</td>
                  <td>${s.amount ? `€${s.amount.toFixed(2)}` : '—'}</td>
                  <td><span class="badge badge-${s.status}">${s.status}</span></td>
                  <td class="text-sm text-muted">${new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      ` : ''}
    `;
  }
}
