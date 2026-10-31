import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({ build: { rollupOptions: { input: { home: fileURLToPath(new URL('./index.html', import.meta.url)), about: fileURLToPath(new URL('./about/index.html', import.meta.url)), contact: fileURLToPath(new URL('./contact/index.html', import.meta.url)) } } } });
