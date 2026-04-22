<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {peopleStore} from '@/store';
import type {Person} from '@/models';
import {
  FwbButton,
  FwbInput,
  FwbModal,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow
} from 'flowbite-vue';

const { t } = useI18n();

const people = ref<Person[]>([]);
const showModal = ref(false);
const editingPerson = ref<Partial<Person> | null>(null);

const form = ref({
  name: '',
  email: ''
});

async function loadPeople() {
  people.value = await peopleStore.getAll();
}

onMounted(loadPeople);

function openAddModal() {
  editingPerson.value = null;
  form.value = {name: '', email: ''};
  showModal.value = true;
}

function openEditModal(person: Person) {
  editingPerson.value = person;
  form.value = {name: person.name, email: person.email};
  showModal.value = true;
}

async function savePerson() {
  if (editingPerson.value?.id) {
    await peopleStore.update(editingPerson.value.id, form.value);
  } else {
    await peopleStore.create(form.value);
  }
  showModal.value = false;
  await loadPeople();
}

async function deletePerson(id: string) {
  if (confirm(t('common.confirmDelete') || 'Are you sure?')) {
    await peopleStore.remove(id);
    await loadPeople();
  }
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">{{ t('nav.people') }}</h1>
    <fwb-button @click="openAddModal" color="blue">
      {{ t('common.add') }}
    </fwb-button>
  </div>

  <fwb-table hoverable>
    <fwb-table-head>
      <fwb-table-head-cell>Name</fwb-table-head-cell>
      <fwb-table-head-cell>Email</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Actions</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="person in people" :key="person.id">
        <fwb-table-cell>{{ person.name }}</fwb-table-cell>
        <fwb-table-cell>{{ person.email }}</fwb-table-cell>
        <fwb-table-cell class="text-right">
          <button @click="openEditModal(person)"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">
            {{ t('common.edit') }}
          </button>
          <button @click="deletePerson(person.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline">
            {{ t('common.delete') }}
          </button>
        </fwb-table-cell>
      </fwb-table-row>
      <fwb-table-row v-if="people.length === 0">
        <fwb-table-cell colspan="3" class="text-center py-4 text-gray-500">
          {{ t('common.noData') }}
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>

  <fwb-modal v-if="showModal" @close="showModal = false">
    <template #header>
      <div class="flex items-center text-lg">
        {{ editingPerson ? t('common.edit') : t('common.add') }} {{ t('nav.people').toLowerCase() }}
      </div>
    </template>
    <template #body>
      <div class="space-y-4">
        <fwb-input v-model="form.name" label="Name" placeholder="John Doe" required/>
        <fwb-input v-model="form.email" label="Email" type="email" placeholder="john@example.com" required/>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button @click="showModal = false" color="alternative">
          {{ t('common.cancel') }}
        </fwb-button>
        <fwb-button @click="savePerson" color="blue">
          {{ t('common.save') }}
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
