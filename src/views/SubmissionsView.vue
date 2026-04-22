<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {dealStore, ibanStore, peopleStore, submissionStore} from '../store';
import type {Deal, Iban, Person, Submission, SubmissionStatus} from '../models';
import {
  FwbBadge,
  FwbButton,
  FwbInput,
  FwbModal,
  FwbSelect,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbTextarea
} from 'flowbite-vue';

const { t } = useI18n();

const submissions = ref<Submission[]>([]);
const deals = ref<Deal[]>([]);
const people = ref<Person[]>([]);
const ibans = ref<Iban[]>([]);
const showModal = ref(false);
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

const dealOptions = computed(() => deals.value.map(d => ({value: d.id, name: d.title})));
const personOptions = computed(() => people.value.map(p => ({value: p.id, name: p.name})));
const filteredIbanOptions = computed(() =>
    ibans.value
        .filter(i => i.personId === form.value.personId)
        .map(i => ({value: i.id, name: `${i.label} (${i.iban})`}))
);

const statusOptions = [
  {value: 'pending', name: 'Pending'},
  {value: 'submitted', name: 'Submitted'},
  {value: 'approved', name: 'Approved'},
  {value: 'rejected', name: 'Rejected'},
  {value: 'paid', name: 'Paid'}
];

function getDealTitle(id: string) {
  return deals.value.find(d => d.id === id)?.title || id;
}

function getPersonName(id: string) {
  return people.value.find(p => p.id === id)?.name || id;
}

function getStatusColor(status: SubmissionStatus) {
  switch (status) {
    case 'paid':
      return 'green';
    case 'approved':
      return 'blue';
    case 'rejected':
      return 'red';
    case 'submitted':
      return 'indigo';
    default:
      return 'gray';
  }
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
  // Select first IBAN of first person if available
  const personIbans = ibans.value.filter(i => i.personId === form.value.personId);
  if (personIbans.length > 0) form.value.ibanId = personIbans[0].id;

  showModal.value = true;
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
  showModal.value = true;
}

async function saveSubmission() {
  if (editingSubmission.value?.id) {
    await submissionStore.update(editingSubmission.value.id, form.value);
  } else {
    await submissionStore.create(form.value);
  }
  showModal.value = false;
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
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">{{ t('nav.submissions') }}</h1>
    <fwb-button @click="openAddModal" color="blue">
      {{ t('common.add') }}
    </fwb-button>
  </div>

  <fwb-table hoverable>
    <fwb-table-head>
      <fwb-table-head-cell>Deal</fwb-table-head-cell>
      <fwb-table-head-cell>Person</fwb-table-head-cell>
      <fwb-table-head-cell>Amount</fwb-table-head-cell>
      <fwb-table-head-cell>Status</fwb-table-head-cell>
      <fwb-table-head-cell>Date</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Actions</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="sub in submissions" :key="sub.id">
        <fwb-table-cell class="font-medium">{{ getDealTitle(sub.dealId) }}</fwb-table-cell>
        <fwb-table-cell>{{ getPersonName(sub.personId) }}</fwb-table-cell>
        <fwb-table-cell>{{ sub.amount.toFixed(2) }} €</fwb-table-cell>
        <fwb-table-cell>
          <fwb-badge :color="getStatusColor(sub.status)">{{ sub.status }}</fwb-badge>
        </fwb-table-cell>
        <fwb-table-cell>{{ sub.submittedAt }}</fwb-table-cell>
        <fwb-table-cell class="text-right">
          <button @click="openEditModal(sub)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">
            {{ t('common.edit') }}
          </button>
          <button @click="deleteSubmission(sub.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline">
            {{ t('common.delete') }}
          </button>
        </fwb-table-cell>
      </fwb-table-row>
      <fwb-table-row v-if="submissions.length === 0">
        <fwb-table-cell colspan="6" class="text-center py-4 text-gray-500">
          {{ t('common.noData') }}
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>

  <fwb-modal v-if="showModal" @close="showModal = false">
    <template #header>
      <div class="flex items-center text-lg">
        {{ editingSubmission ? t('common.edit') : t('common.add') }} {{ t('nav.submissions').toLowerCase() }}
      </div>
    </template>
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fwb-select v-model="form.dealId" :options="dealOptions" label="Deal" required class="md:col-span-2"/>
        <fwb-select v-model="form.personId" :options="personOptions" label="Person" required/>
        <fwb-select v-model="form.ibanId" :options="filteredIbanOptions" label="IBAN" required/>
        <fwb-input v-model="form.amount" label="Amount (€)" type="number" step="0.01" required/>
        <fwb-input v-model="form.submittedAt" label="Submitted At" type="date" required/>
        <fwb-select v-model="form.status" :options="statusOptions" label="Status" required/>
        <fwb-textarea v-model="form.notes" label="Notes" placeholder="Additional info..." class="md:col-span-2"/>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button @click="showModal = false" color="alternative">
          {{ t('common.cancel') }}
        </fwb-button>
        <fwb-button @click="saveSubmission" color="blue">
          {{ t('common.save') }}
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
