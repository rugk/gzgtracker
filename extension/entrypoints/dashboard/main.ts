import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {router} from '../../../src/router';
import {i18n} from '../../../src/i18n';
import App from '../../../src/App.vue';
import '../../../src/styles.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');
