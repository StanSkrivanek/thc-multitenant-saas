<script lang="ts">
	import { setContext } from 'svelte';
	import type { AppConfig, Theme } from '$lib/types/context';

	interface Props {
		data: {
			appConfig: AppConfig;
			session: { userId: string; name: string; email: string; role: string } | null;
		};
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Getter wrappers for the same reason as tenant/features in (app)/+layout.svelte:
	// data is reactive ($props). Reading data.appConfig or data.session directly
	// at the top-level script body captures only the initial value. A getter
	// defers the read so consumers always get the live value via .current.
	setContext<{ readonly current: AppConfig }>('appConfig', {
		get current() {
			return data.appConfig;
		}
	});
	setContext<{ readonly current: typeof data.session }>('session', {
		get current() {
			return data.session;
		}
	});

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
