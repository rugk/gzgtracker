import localforage from 'localforage';
import type { Person, Iban, Deal, Submission } from './models.js';

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

class Store<T extends { id: string; createdAt: string; updatedAt: string }> {
  private _instance: LocalForage;
  private _listeners = new Set<() => void>();

  constructor(name: string) {
    this._instance = localforage.createInstance({ name });
  }

  onChange(cb: () => void): () => void {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  private _notify() {
    this._listeners.forEach((fn) => fn());
  }

  async getAll(): Promise<T[]> {
    const items: T[] = [];
    await this._instance.iterate<T, void>((value) => {
      items.push(value);
    });
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return items;
  }

  async getById(id: string): Promise<T | null> {
    return this._instance.getItem<T>(id);
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const ts = now();
    const item = { ...data, id: generateId(), createdAt: ts, updatedAt: ts } as T;
    await this._instance.setItem(item.id, item);
    this._notify();
    return item;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T | null> {
    const existing = await this._instance.getItem<T>(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: now() } as T;
    await this._instance.setItem(id, updated);
    this._notify();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this._instance.removeItem(id);
    this._notify();
  }
}

export const peopleStore = new Store<Person>('gzg-people');
export const ibanStore = new Store<Iban>('gzg-ibans');
export const dealStore = new Store<Deal>('gzg-deals');
export const submissionStore = new Store<Submission>('gzg-submissions');
