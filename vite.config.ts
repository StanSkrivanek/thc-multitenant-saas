import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	ssr: {
		// lucide-svelte@0.575.0 ships extensionless ESM imports (e.g. './icons/index')
		// which break Node 24's strict ESM resolver. Bundling it via Rollup/Vite
		// instead of leaving it as a Node-native external works around this.
		noExternal: ['lucide-svelte']
	}
});
