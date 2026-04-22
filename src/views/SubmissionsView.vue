<script setup lang="ts">
import {computed, onMounted, ref, useTemplateRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {dealStore, ibanStore, peopleStore, submissionStore} from '../store';
import type {Deal, Iban, Person, Submission, SubmissionStatus} from '../models';

const { t } = useI18n();

const submissions = ref<Submission[]>([]);
const deals = ref<Deal[]>([]);
const people = ref<Person[]>([]);
const ibans = ref<Iban[]>([]);
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef');
const editingSubmission = ref<Partial<Submission> | null>(null);

const form = ref({
  dealId: '',
  personId: '',
  ibanId: '',
  amount: 0,
  status: 'submitted' as SubmissionStatus,
  submittedAt: '',
  notes: ''
});

async function loadData() {
  const [s, d, p, i] = await Promise.all([
    submissionStore.getAll(),
    dealStore.getAll(),
    peopleStore.getAll(),
    ibanStore.getAll()
  ]);
  submissions.value = s;
  deals.value = d;
  people.value = p;
  ibans.value = i;
}

onMounted(loadData);

const filteredIbanOptions = computed(() =>
    ibans.value.filter(i => i.personId === form.value.personId)
);

function getDealTitle(id: string) {
  return deals.value.find(d => d.id === id)?.title || id;
}

function getPersonName(id: string) {
  return people.value.find(p => p.id === id)?.name || id;
}

function openAddModal() {
  editingSubmission.value = null;
  form.value = {
    dealId: deals.value[0]?.id || '',
    personId: people.value[0]?.id || '',
    ibanId: '',
    amount: 0,
    status: 'submitted',
    submittedAt: new Date().toISOString().split('T')[0],
    notes: ''
  };
  const personIbans = ibans.value.filter(i => i.personId === form.value.personId);
  if (personIbans.length > 0) form.value.ibanId = personIbans[0].id;
  dialogRef.value?.showModal();
}

function openEditModal(sub: Submission) {
  editingSubmission.value = sub;
  form.value = {
    dealId: sub.dealId,
    personId: sub.personId,
    ibanId: sub.ibanId,
    amount: sub.amount,
    status: sub.status,
    submittedAt: sub.submittedAt,
    notes: sub.notes
  };
  dialogRef.value?.showModal();
}

async function saveSubmission() {
  if (editingSubmission.value?.id) {
    await submissionStore.update(editingSubmission.value.id, form.value);
  } else {
    await submissionStore.create(form.value);
  }
  dialogRef.value?.close();
  await loadData();
}

async function deleteSubmission(id: string) {
  if (confirm(t('common.confirmDelete') || 'Are you sure?')) {
    await submissionStore.remove(id);
    await loadData();
  }
}
</script>

<template>
  <div class="header-row">
    <h1>{{ t('nav.submissions') }}</h1>
    <button @click="openAddModal">{{ t('common.add') }}</button>
  </div>

  <table>
    <thead>
    <tr>
      <th>Deal</th>
      <th>Person</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Date</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="sub in submissions" :key="sub.id">
      <td><strong>{{ getDealTitle(sub.dealId) }}</strong></td>
      <td>{{ getPersonName(sub.personId) }}</td>
      <td>{{ sub.amount.toFixed(2) }} €</td>
      <td><span class="status-badge" :class="sub.status">{{ sub.status }}</span></td>
      <td>{{ sub.submittedAt }}</td>
      <td class="actions">
        <button class="outline" @click="openEditModal(sub)">{{ t('common.edit') }}</button>
        <button class="outline secondary" @click="deleteSubmission(sub.id)">{{ t('common.delete') }}</button>
      </td>
    </tr>
    <tr v-if="submissions.length === 0">
      <td colspan="6" style="text-align:center">{{ t('common.noData') }}</td>
    </tr>
    </tbody>
  </table>

  <dialog ref="dialogRef">
    <article>
      <header>
        <button aria-label="Close" rel="prev" @click="dialogRef?.close()"></button>
        <h2>{{ editingSubmission ? t('common.edit') : t('common.add') }} {{ t('nav.submissions').toLowerCase() }}</h2>
      </header>
      <div class="form-grid">
        <label class="full-width">
          Deal
          <select v-model="form.dealId" required>
            <option v-for="d in deals" :key="d.id" :value="d.id">{{ d.title }}</option>
          </select>
        </label>
        <label>
          Person
          <select v-model="form.personId" required>
            <option v-for="p in people" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>
        <label>
          IBAN
          <select v-model="form.ibanId" required>
            <option v-for="i in filteredIbanOptions" :key="i.id" :value="i.id">{{ i.label }} ({{ i.iban }})</option>
          </select>
        </label>
        <label>
          Amount (€)
          <input v-model="form.amount" type="number" step="0.01" required/>
        </label>
        <label>
          Submitted At
          <input v-model="form.submittedAt" type="date" required/>
        </label>
        <label>
          Status
          <select v-model="form.status" required>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <label class="full-width">
          Notes
          <textarea v-model="form.notes" placeholder="Additional info..."></textarea>
        </label>
      </div>
      <footer class="modal-footer">
        <button class="secondary" @click="dialogRef?.close()">{{ t('common.cancel') }}</button>
        <button @click="saveSubmission">{{ t('common.save') }}</button>
      </footer>
    </article>
  </dialog>
</template>
