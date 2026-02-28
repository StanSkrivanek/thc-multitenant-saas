<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import type { AppConfig, Theme } from '$lib/types/context';
	import { setContext } from 'svelte';

	interface Props {
		data: {
			appConfig: AppConfig;
			session: { userId: string; name: string; email: string; role: string } | null;
		};
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Set global app config — consumed by any component that needs it
	setContext<AppConfig>('appConfig', data.appConfig);
	setContext('session', data.session);

	// Base theme — will be shadowed by tenant and admin layouts
	const defaultTheme: Theme = {
		mode: 'light',
		colors: {
			primary: '#6366f1',
			accent: '#8b5cf6',
			background: '#ffffff',
			surface: '#f8fafc',
			border: '#e2e8f0',
			text: '#1e293b',
			textMuted: '#64748b'
		}
	};

	setContext<Theme>('theme', defaultTheme);
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

{@render children()}

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
	:global(body) {
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1.5;
	}
	:global(a) {
		color: inherit;
	}
</style>
