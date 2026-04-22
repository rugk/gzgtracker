import { css } from 'lit';

/** Shared Tailwind-inspired design tokens for Lit Shadow DOM components. */
export const sharedStyles = css`
  :host {
    display: block;
    font-family: system-ui, -apple-system, sans-serif;
    color: #1e293b;
  }

  h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  /* ---------- Buttons ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
  }
  .btn-primary {
    background: #2563eb;
    color: #fff;
  }
  .btn-primary:hover {
    background: #1d4ed8;
  }
  .btn-secondary {
    background: #e2e8f0;
    color: #334155;
  }
  .btn-secondary:hover {
    background: #cbd5e1;
  }
  .btn-danger {
    background: #ef4444;
    color: #fff;
  }
  .btn-danger:hover {
    background: #dc2626;
  }
  .btn-sm {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }

  /* ---------- Cards / Panels ---------- */
  .card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
  }

  /* ---------- Table ---------- */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  th {
    text-align: left;
    padding: 0.625rem 0.75rem;
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
  }
  td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }
  tr:hover td {
    background: #f8fafc;
  }

  /* ---------- Forms ---------- */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1rem;
  }
  label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #475569;
  }
  input, select, textarea {
    padding: 0.5rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #1e293b;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.15);
  }
  textarea {
    resize: vertical;
    min-height: 4rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  /* ---------- Toolbar ---------- */
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  /* ---------- Empty state ---------- */
  .empty {
    text-align: center;
    padding: 3rem 1rem;
    color: #94a3b8;
    font-size: 0.9375rem;
  }

  /* ---------- Badge ---------- */
  .badge {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  .badge-pending   { background: #fef3c7; color: #92400e; }
  .badge-submitted { background: #dbeafe; color: #1e40af; }
  .badge-approved  { background: #d1fae5; color: #065f46; }
  .badge-rejected  { background: #fee2e2; color: #991b1b; }
  .badge-paid      { background: #d1fae5; color: #065f46; }

  /* ---------- Utilities ---------- */
  .text-muted { color: #94a3b8; }
  .text-sm { font-size: 0.8125rem; }
  .mt-4 { margin-top: 1rem; }
  .mb-4 { margin-bottom: 1rem; }
  .flex { display: flex; }
  .gap-2 { gap: 0.5rem; }
  .items-center { align-items: center; }
`;
