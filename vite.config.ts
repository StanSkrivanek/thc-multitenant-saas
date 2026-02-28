import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	ssr: {
		// lucide-svelte@0.575.0 ships extensionless ESM imports (e.g. './icons/index' instead of './icons/index.js'),
		// which break Node's strict ESM resolver. Bundling via Vite works around this.
		noExternal: ['lucide-svelte']
	}
});
