<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePeopleStore } from '@/stores/people'

const { t } = useI18n()
const peopleStore = usePeopleStore()

const showModal = ref(false)
const editingPerson = ref(null)
const searchQuery = ref('')

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  contacts: []
})

const filteredPeople = computed(() => {
  if (!searchQuery.value) return peopleStore.people

  const query = searchQuery.value.toLowerCase()
  return peopleStore.people.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.email.toLowerCase().includes(query)
  )
})

function openAddModal() {
  editingPerson.value = null
  form.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    contacts: []
  }
  showModal.value = true
}

function openEditModal(person) {
  editingPerson.value = person
  form.value = { ...person }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingPerson.value = null
}

function savePerson() {
  if (!form.value.name.trim()) {
    alert(t('validation.required'))
    return
  }

  if (editingPerson.value) {
    peopleStore.updatePerson(editingPerson.value.id, form.value)
  } else {
    peopleStore.addPerson(form.value)
  }

  closeModal()
}

function deletePerson(id) {
  if (confirm(t('people.deleteConfirm'))) {
    peopleStore.deletePerson(id)
  }
}

function addContact() {
  form.value.contacts.push({ type: 'email', value: '' })
}

function removeContact(index) {
  form.value.contacts.splice(index, 1)
}
</script>

<template>
  <div class="people-view">
    <div class="view-header">
      <h1 class="page-title">{{ t('people.title') }}</h1>
      <button @click="openAddModal" class="btn btn-primary">
        + {{ t('people.add') }}
      </button>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('common.search')"
        class="search-input"
      />
    </div>

    <div v-if="filteredPeople.length === 0" class="empty-state">
      {{ t('common.noData') }}
    </div>

    <div v-else class="people-grid">
      <div v-for="person in filteredPeople" :key="person.id" class="person-card">
        <div class="person-info">
          <h3>{{ person.name }}</h3>
          <p v-if="person.email" class="person-detail">
            <span class="label">{{ t('people.email') }}:</span> {{ person.email }}
          </p>
          <p v-if="person.phone" class="person-detail">
            <span class="label">{{ t('people.phone') }}:</span> {{ person.phone }}
          </p>
          <p v-if="person.address" class="person-detail">
            <span class="label">{{ t('people.address') }}:</span> {{ person.address }}
          </p>
          <p v-if="person.contacts && person.contacts.length > 0" class="person-detail">
            <span class="label">{{ t('people.contacts') }}:</span> {{ person.contacts.length }}
          </p>
        </div>
        <div class="person-actions">
          <button @click="openEditModal(person)" class="btn btn-sm btn-secondary">
            {{ t('common.edit') }}
          </button>
          <button @click="deletePerson(person.id)" class="btn btn-sm btn-danger">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingPerson ? t('people.edit') : t('people.add') }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('people.name') }} *</label>
            <input v-model="form.name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>{{ t('people.email') }}</label>
            <input v-model="form.email" type="email" class="form-input" />
          </div>

          <div class="form-group">
            <label>{{ t('people.phone') }}</label>
            <input v-model="form.phone" type="tel" class="form-input" />
          </div>

          <div class="form-group">
            <label>{{ t('people.address') }}</label>
            <textarea v-model="form.address" class="form-input" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>{{ t('people.contacts') }}</label>
            <div v-for="(contact, index) in form.contacts" :key="index" class="contact-row">
              <select v-model="contact.type" class="form-input form-select">
                <option value="email">{{ t('people.email') }}</option>
                <option value="phone">{{ t('people.phone') }}</option>
                <option value="address">{{ t('people.address') }}</option>
              </select>
              <input v-model="contact.value" type="text" class="form-input" :placeholder="t('people.contactValue')" />
              <button @click="removeContact(index)" class="btn btn-sm btn-danger">&times;</button>
            </div>
            <button @click="addContact" class="btn btn-sm btn-secondary">
              + {{ t('people.addContact') }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="savePerson" class="btn btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--text-primary);
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.person-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.person-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.person-detail {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.person-detail .label {
  font-weight: 500;
  color: var(--text-primary);
}

.person-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-danger {
  background-color: var(--error);
  color: white;
}

.btn-danger:hover {
  opacity: 0.9;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
  background-color: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background-color: var(--bg-primary);
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.contact-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-select {
  width: auto;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .people-grid {
    grid-template-columns: 1fr;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
