<script setup lang="ts">
import {onMounted, ref, useTemplateRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {peopleStore} from '../store';
import type {Person} from '../models';

const { t } = useI18n();

const people = ref<Person[]>([]);
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef');
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
  dialogRef.value?.showModal();
}

function openEditModal(person: Person) {
  editingPerson.value = person;
  form.value = {name: person.name, email: person.email};
  dialogRef.value?.showModal();
}

async function savePerson() {
  if (editingPerson.value?.id) {
    await peopleStore.update(editingPerson.value.id, form.value);
  } else {
    await peopleStore.create(form.value);
  }
  dialogRef.value?.close();
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
  <div class="header-row">
    <h1>{{ t('nav.people') }}</h1>
    <button @click="openAddModal">{{ t('common.add') }}</button>
  </div>

  <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="person in people" :key="person.id">
      <td>{{ person.name }}</td>
      <td>{{ person.email }}</td>
      <td class="actions">
        <button class="outline" @click="openEditModal(person)">{{ t('common.edit') }}</button>
        <button class="outline secondary" @click="deletePerson(person.id)">{{ t('common.delete') }}</button>
      </td>
    </tr>
    <tr v-if="people.length === 0">
      <td colspan="3" style="text-align:center">{{ t('common.noData') }}</td>
    </tr>
    </tbody>
  </table>

  <dialog ref="dialogRef">
    <article>
      <header>
        <button aria-label="Close" rel="prev" @click="dialogRef?.close()"></button>
        <h2>{{ editingPerson ? t('common.edit') : t('common.add') }} {{ t('nav.people').toLowerCase() }}</h2>
      </header>
      <label>
        Name
        <input v-model="form.name" placeholder="John Doe" required/>
      </label>
      <label>
        Email
        <input v-model="form.email" type="email" placeholder="john@example.com" required/>
      </label>
      <footer class="modal-footer">
        <button class="secondary" @click="dialogRef?.close()">{{ t('common.cancel') }}</button>
        <button @click="savePerson">{{ t('common.save') }}</button>
      </footer>
    </article>
  </dialog>
</template>
