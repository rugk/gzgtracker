import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    base: "/gzgtracker/",
    plugins: [vue()],
    test: {
        environment: 'happy-dom',
    },
});
