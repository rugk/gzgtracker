import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {router} from '../../../src/router';
import {i18n} from '../../../src/i18n';
import '../../../src/styles.css';
import ExtensionPopup from "./ExtensionPopup.vue";

const app = createApp(ExtensionPopup);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');
