<script setup lang="ts">
import {onMounted, ref, useTemplateRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {dealStore} from '../store';
import type {Deal} from '../models';

const { t } = useI18n();

const deals = ref<Deal[]>([]);
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef');
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
  dialogRef.value?.showModal();
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
  dialogRef.value?.showModal();
}

async function saveDeal() {
  if (editingDeal.value?.id) {
    await dealStore.update(editingDeal.value.id, form.value);
  } else {
    await dealStore.create(form.value);
  }
  dialogRef.value?.close();
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
  <div class="header-row">
    <h1>{{ t('nav.deals') }}</h1>
    <button @click="openAddModal">{{ t('common.add') }}</button>
  </div>

  <table>
    <thead>
    <tr>
      <th>Title</th>
      <th>Brand</th>
      <th>Max Cashback</th>
      <th>End Date</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="deal in deals" :key="deal.id">
      <td><strong>{{ deal.title }}</strong></td>
      <td>{{ deal.brand }}</td>
      <td>{{ deal.maxCashback.toFixed(2) }} €</td>
      <td>{{ deal.endDate }}</td>
      <td class="actions">
        <button class="outline" @click="openEditModal(deal)">{{ t('common.edit') }}</button>
        <button class="outline secondary" @click="deleteDeal(deal.id)">{{ t('common.delete') }}</button>
      </td>
    </tr>
    <tr v-if="deals.length === 0">
      <td colspan="5" style="text-align:center">{{ t('common.noData') }}</td>
    </tr>
    </tbody>
  </table>

  <dialog ref="dialogRef">
    <article>
      <header>
        <button aria-label="Close" rel="prev" @click="dialogRef?.close()"></button>
        <h2>{{ editingDeal ? t('common.edit') : t('common.add') }} {{ t('nav.deals').toLowerCase() }}</h2>
      </header>
      <div class="form-grid">
        <label class="full-width">
          Title
          <input v-model="form.title" placeholder="Brand Cashback" required/>
        </label>
        <label>
          Brand
          <input v-model="form.brand" placeholder="Brand Name" required/>
        </label>
        <label>
          Max Cashback (€)
          <input v-model="form.maxCashback" type="number" step="0.01" required/>
        </label>
        <label>
          Start Date
          <input v-model="form.startDate" type="date" required/>
        </label>
        <label>
          End Date
          <input v-model="form.endDate" type="date" required/>
        </label>
        <label class="full-width">
          URL
          <input v-model="form.url" placeholder="https://..."/>
        </label>
        <label class="full-width">
          Notes
          <textarea v-model="form.notes" placeholder="Additional info..."></textarea>
        </label>
      </div>
      <footer class="modal-footer">
        <button class="secondary" @click="dialogRef?.close()">{{ t('common.cancel') }}</button>
        <button @click="saveDeal">{{ t('common.save') }}</button>
      </footer>
    </article>
  </dialog>
</template>
