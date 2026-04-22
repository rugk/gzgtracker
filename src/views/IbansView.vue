<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {ibanStore, peopleStore} from '../store';
import type {Iban, Person} from '../models';
import {
  FwbButton,
  FwbInput,
  FwbModal,
  FwbSelect,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow
} from 'flowbite-vue';

const { t } = useI18n();

const ibans = ref<Iban[]>([]);
const people = ref<Person[]>([]);
const showModal = ref(false);
const editingIban = ref<Partial<Iban> | null>(null);

const form = ref({
  label: '',
  iban: '',
  personId: ''
});

async function loadData() {
  const [ibanList, peopleList] = await Promise.all([
    ibanStore.getAll(),
    peopleStore.getAll()
  ]);
  ibans.value = ibanList;
  people.value = peopleList;
}

onMounted(loadData);

function getPersonName(personId: string) {
  return people.value.find(p => p.id === personId)?.name || personId;
}

const personOptions = ref<{ value: string; name: string }[]>([]);

function updatePersonOptions() {
  personOptions.value = people.value.map(p => ({value: p.id, name: p.name}));
}

function openAddModal() {
  editingIban.value = null;
  form.value = {label: '', iban: '', personId: people.value[0]?.id || ''};
  updatePersonOptions();
  showModal.value = true;
}

function openEditModal(iban: Iban) {
  editingIban.value = iban;
  form.value = {label: iban.label, iban: iban.iban, personId: iban.personId};
  updatePersonOptions();
  showModal.value = true;
}

async function saveIban() {
  if (editingIban.value?.id) {
    await ibanStore.update(editingIban.value.id, form.value);
  } else {
    await ibanStore.create(form.value);
  }
  showModal.value = false;
  await loadData();
}

async function deleteIban(id: string) {
  if (confirm(t('common.confirmDelete') || 'Are you sure?')) {
    await ibanStore.remove(id);
    await loadData();
  }
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">{{ t('nav.ibans') }}</h1>
    <fwb-button @click="openAddModal" color="blue">
      {{ t('common.add') }}
    </fwb-button>
  </div>

  <fwb-table hoverable>
    <fwb-table-head>
      <fwb-table-head-cell>Label</fwb-table-head-cell>
      <fwb-table-head-cell>IBAN</fwb-table-head-cell>
      <fwb-table-head-cell>Person</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Actions</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="iban in ibans" :key="iban.id">
        <fwb-table-cell>{{ iban.label }}</fwb-table-cell>
        <fwb-table-cell class="font-mono text-sm">{{ iban.iban }}</fwb-table-cell>
        <fwb-table-cell>{{ getPersonName(iban.personId) }}</fwb-table-cell>
        <fwb-table-cell class="flex justify-end gap-2">
          <fwb-button @click="openEditModal(iban)" color="blue" size="sm" outline>
            {{ t('common.edit') }}
          </fwb-button>
          <fwb-button @click="deleteIban(iban.id)" color="red" size="sm" outline>
            {{ t('common.delete') }}
          </fwb-button>
        </fwb-table-cell>
      </fwb-table-row>
      <fwb-table-row v-if="ibans.length === 0">
        <fwb-table-cell colspan="4" class="text-center py-4 text-gray-500">
          {{ t('common.noData') }}
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>

  <fwb-modal v-if="showModal" @close="showModal = false">
    <template #header>
      <div class="flex items-center text-lg">
        {{ editingIban ? t('common.edit') : t('common.add') }} {{ t('nav.ibans').toLowerCase() }}
      </div>
    </template>
    <template #body>
      <div class="space-y-4">
        <fwb-input v-model="form.label" label="Label" placeholder="Personal Account" required/>
        <fwb-input v-model="form.iban" label="IBAN" placeholder="DE00..." required/>
        <fwb-select v-model="form.personId" :options="personOptions" label="Person" required/>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button @click="showModal = false" color="alternative">
          {{ t('common.cancel') }}
        </fwb-button>
        <fwb-button @click="saveIban" color="blue">
          {{ t('common.save') }}
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
