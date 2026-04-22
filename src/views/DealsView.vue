<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {dealStore} from '@/store';
import type {Deal} from '@/models';
import {
  FwbButton,
  FwbInput,
  FwbModal,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbTextarea
} from 'flowbite-vue';

const { t } = useI18n();

const deals = ref<Deal[]>([]);
const showModal = ref(false);
const editingDeal = ref<Partial<Deal> | null>(null);

const form = ref({
  title: '',
  brand: '',
  maxCashback: 0,
  startDate: '',
  endDate: '',
  url: '',
  notes: ''
});

async function loadDeals() {
  deals.value = await dealStore.getAll();
}

onMounted(loadDeals);

function openAddModal() {
  editingDeal.value = null;
  form.value = {
    title: '',
    brand: '',
    maxCashback: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    url: '',
    notes: ''
  };
  showModal.value = true;
}

function openEditModal(deal: Deal) {
  editingDeal.value = deal;
  form.value = {
    title: deal.title,
    brand: deal.brand,
    maxCashback: deal.maxCashback,
    startDate: deal.startDate,
    endDate: deal.endDate,
    url: deal.url,
    notes: deal.notes
  };
  showModal.value = true;
}

async function saveDeal() {
  if (editingDeal.value?.id) {
    await dealStore.update(editingDeal.value.id, form.value);
  } else {
    await dealStore.create(form.value);
  }
  showModal.value = false;
  await loadDeals();
}

async function deleteDeal(id: string) {
  if (confirm(t('common.confirmDelete') || 'Are you sure?')) {
    await dealStore.remove(id);
    await loadDeals();
  }
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">{{ t('nav.deals') }}</h1>
    <fwb-button @click="openAddModal" color="blue">
      {{ t('common.add') }}
    </fwb-button>
  </div>

  <fwb-table hoverable>
    <fwb-table-head>
      <fwb-table-head-cell>Title</fwb-table-head-cell>
      <fwb-table-head-cell>Brand</fwb-table-head-cell>
      <fwb-table-head-cell>Max Cashback</fwb-table-head-cell>
      <fwb-table-head-cell>End Date</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Actions</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="deal in deals" :key="deal.id">
        <fwb-table-cell class="font-medium text-gray-900 dark:text-white">{{ deal.title }}</fwb-table-cell>
        <fwb-table-cell>{{ deal.brand }}</fwb-table-cell>
        <fwb-table-cell>{{ deal.maxCashback.toFixed(2) }} €</fwb-table-cell>
        <fwb-table-cell>{{ deal.endDate }}</fwb-table-cell>
        <fwb-table-cell class="text-right">
          <button @click="openEditModal(deal)"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">
            {{ t('common.edit') }}
          </button>
          <button @click="deleteDeal(deal.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline">
            {{ t('common.delete') }}
          </button>
        </fwb-table-cell>
      </fwb-table-row>
      <fwb-table-row v-if="deals.length === 0">
        <fwb-table-cell colspan="5" class="text-center py-4 text-gray-500">
          {{ t('common.noData') }}
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>

  <fwb-modal v-if="showModal" @close="showModal = false">
    <template #header>
      <div class="flex items-center text-lg">
        {{ editingDeal ? t('common.edit') : t('common.add') }} {{ t('nav.deals').toLowerCase() }}
      </div>
    </template>
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fwb-input v-model="form.title" label="Title" placeholder="Brand Cashback" required class="md:col-span-2"/>
        <fwb-input v-model="form.brand" label="Brand" placeholder="Brand Name" required/>
        <fwb-input v-model="form.maxCashback" label="Max Cashback (€)" type="number" step="0.01" required/>
        <fwb-input v-model="form.startDate" label="Start Date" type="date" required/>
        <fwb-input v-model="form.endDate" label="End Date" type="date" required/>
        <fwb-input v-model="form.url" label="URL" placeholder="https://..." class="md:col-span-2"/>
        <fwb-textarea v-model="form.notes" label="Notes" placeholder="Additional info..." class="md:col-span-2"/>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button @click="showModal = false" color="alternative">
          {{ t('common.cancel') }}
        </fwb-button>
        <fwb-button @click="saveDeal" color="blue">
          {{ t('common.save') }}
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
