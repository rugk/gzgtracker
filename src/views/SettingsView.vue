<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import type {SyncProvider} from '../sync';
import {InternalWebExtSyncProvider, syncRegistry, syncService} from '../sync';

const { t, locale } = useI18n();

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'de' : 'en';
}

// --- Sync settings ---
const selectedProviderKey = ref('');
const selectedProvider = ref<SyncProvider | undefined>();
const configValues = ref<Record<string, string>>({});
const syncStatus = ref('');
const syncing = ref(false);
const debugJson = ref('');

watch(selectedProviderKey, (key) => {
  selectedProvider.value = syncRegistry.get(key);
  if (selectedProvider.value) {
    const fields = Object.keys(selectedProvider.value.configFields);
    const fresh: Record<string, string> = {};
    for (const f of fields) fresh[f] = configValues.value[f] ?? '';
    configValues.value = fresh;
  }
});

const allProviders = syncRegistry.getAll();
const providers = ref<SyncProvider[]>([]);

onMounted(async () => {
  // Filter providers
  providers.value = allProviders.filter(p => {
    if (p instanceof InternalWebExtSyncProvider) {
      return p.isAvailable();
    }
    return true;
  });

  const cfg = await syncService.loadConfig();
  if (cfg) {
    selectedProviderKey.value = cfg.providerKey;
    configValues.value = {...cfg.config};
  }
});

async function saveSync() {
  if (!selectedProviderKey.value) {
    await syncService.clearConfig();
    syncStatus.value = t('sync.cleared');
    return;
  }
  await syncService.saveConfig({
    providerKey: selectedProviderKey.value,
    config: {...configValues.value},
  });
  syncStatus.value = t('sync.saved');
}

async function testConnection() {
  const provider = selectedProvider.value;
  if (!provider) return;
  syncStatus.value = t('sync.testing');
  try {
    await provider.testConnection(configValues.value);
    syncStatus.value = t('sync.testOk');
  } catch (e: unknown) {
    syncStatus.value = t('sync.testFail') + (e instanceof Error ? `: ${e.message}` : '');
  }
}

async function runSync() {
  syncing.value = true;
  syncStatus.value = t('sync.running');
  try {
    await syncService.syncAll();
    syncStatus.value = t('sync.done');
  } catch (e: unknown) {
    syncStatus.value = t('sync.error') + (e instanceof Error ? `: ${e.message}` : '');
  } finally {
    syncing.value = false;
  }
}

async function exportJson() {
  debugJson.value = await syncService.exportAllToJson();
}

async function importJson() {
  if (!debugJson.value.trim()) return;
  try {
    await syncService.importFromJson(debugJson.value);
    syncStatus.value = t('sync.importSuccess');
  } catch (e: unknown) {
    syncStatus.value = t('sync.importError') + (e instanceof Error ? e.message : String(e));
  }
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    debugJson.value = e.target?.result as string;
  };
  reader.readAsText(file);
}
</script>

<template>
  <h1>{{ t('nav.settings') }}</h1>

  <article>
    <label>Language / Sprache</label>
    <button @click="toggleLocale">
      {{ locale === 'en' ? 'Wechseln zu Deutsch' : 'Switch to English' }}
    </button>
  </article>

  <article>
    <h2>{{ t('sync.title') }}</h2>

    <label>{{ t('sync.provider') }}</label>
    <select v-model="selectedProviderKey">
      <option value="">{{ t('sync.none') }}</option>
      <option v-for="p in providers" :key="p.key" :value="p.key">{{ p.name }}</option>
    </select>

    <template v-if="selectedProvider">
      <div v-for="(field, key) in selectedProvider.configFields" :key="key" style="margin-top: 0.5rem;">
        <label>{{ field.label }}</label>
        <input
            v-model="configValues[key]"
            :type="field.type"
            :placeholder="field.placeholder ?? ''"
        />
      </div>

      <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button @click="saveSync">{{ t('sync.save') }}</button>
        <button class="secondary" @click="testConnection">{{ t('sync.test') }}</button>
        <button class="contrast" @click="runSync" :disabled="syncing">{{ t('sync.syncNow') }}</button>
      </div>
    </template>

    <template v-else-if="selectedProviderKey === ''">
      <button style="margin-top: 0.5rem;" @click="saveSync">{{ t('sync.save') }}</button>
    </template>

    <p v-if="syncStatus" style="margin-top: 0.5rem;">{{ syncStatus }}</p>
  </article>

  <article>
    <h2>{{ t('sync.manual') }}</h2>
    <textarea
        v-model="debugJson"
        rows="10"
        placeholder='{"gzg-people": [], ...}'
        style="font-family: monospace; font-size: 0.8rem;"
    ></textarea>

    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
      <button @click="exportJson">{{ t('sync.export') }}</button>
      <button class="secondary" @click="importJson">{{ t('sync.import') }}</button>
      <input type="file" accept=".json" @change="handleFileUpload"
             style="font-size: 0.8rem; border: none; padding: 0;"/>
    </div>
  </article>
</template>
