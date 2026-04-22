<script setup lang="ts">
import {onMounted, ref, useTemplateRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {ibanStore, peopleStore} from '../store';
import type {Iban, Person} from '../models';

const { t } = useI18n();

const ibans = ref<Iban[]>([]);
const people = ref<Person[]>([]);
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef');
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

function openAddModal() {
  editingIban.value = null;
  form.value = {label: '', iban: '', personId: people.value[0]?.id || ''};
  dialogRef.value?.showModal();
}

function openEditModal(iban: Iban) {
  editingIban.value = iban;
  form.value = {label: iban.label, iban: iban.iban, personId: iban.personId};
  dialogRef.value?.showModal();
}

async function saveIban() {
  if (editingIban.value?.id) {
    await ibanStore.update(editingIban.value.id, form.value);
  } else {
    await ibanStore.create(form.value);
  }
  dialogRef.value?.close();
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
  <div class="header-row">
    <h1>{{ t('nav.ibans') }}</h1>
    <button @click="openAddModal">{{ t('common.add') }}</button>
  </div>

  <table>
    <thead>
    <tr>
      <th>Label</th>
      <th>IBAN</th>
      <th>Person</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="iban in ibans" :key="iban.id">
      <td>{{ iban.label }}</td>
      <td class="iban-code">{{ iban.iban }}</td>
      <td>{{ getPersonName(iban.personId) }}</td>
      <td class="actions">
        <button class="outline" @click="openEditModal(iban)">{{ t('common.edit') }}</button>
        <button class="outline secondary" @click="deleteIban(iban.id)">{{ t('common.delete') }}</button>
      </td>
    </tr>
    <tr v-if="ibans.length === 0">
      <td colspan="4" style="text-align:center">{{ t('common.noData') }}</td>
    </tr>
    </tbody>
  </table>

  <dialog ref="dialogRef">
    <article>
      <header>
        <button aria-label="Close" rel="prev" @click="dialogRef?.close()"></button>
        <h2>{{ editingIban ? t('common.edit') : t('common.add') }} {{ t('nav.ibans').toLowerCase() }}</h2>
      </header>
      <label>
        Label
        <input v-model="form.label" placeholder="Personal Account" required/>
      </label>
      <label>
        IBAN
        <input v-model="form.iban" placeholder="DE00..." required/>
      </label>
      <label>
        Person
        <select v-model="form.personId" required>
          <option v-for="p in people" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </label>
      <footer class="modal-footer">
        <button class="secondary" @click="dialogRef?.close()">{{ t('common.cancel') }}</button>
        <button @click="saveIban">{{ t('common.save') }}</button>
      </footer>
    </article>
  </dialog>
</template>
