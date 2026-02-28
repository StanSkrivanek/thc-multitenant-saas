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
			primary: '#ff6452',
			accent: '#FF1C01',
			background: '#ffffff',
			surface: '#f4f4f5',
			border: '#e4e4e7',
			text: '#09090b',
			textMuted: '#71717a'
		}
	};

	setContext<Theme>('theme', defaultTheme);
</script>

{@render children()}

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
	:global(:root) {
		--background: #ffffff;
		--foreground: #09090b;
		--card: #ffffff;
		--muted: #f4f4f5;
		--muted-foreground: #71717a;
		--border: #e4e4e7;
		--input: #e4e4e7;
		--radius-sm: 0.375rem;
		--radius: 0.5rem;
		--radius-lg: 0.75rem;
		--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
		--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
	:global(body) {
		margin: 0;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		font-size: 14px;
		line-height: 1.5;
		background: var(--background);
		color: var(--foreground);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	:global(a) {
		color: inherit;
		text-decoration: none;
	}
	:global(h1, h2, h3, h4, h5, h6) {
		margin: 0;
		line-height: 1.25;
		letter-spacing: -0.02em;
	}
	:global(p) {
		margin: 0;
	}
	:global(code) {
		font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace;
		font-size: 0.8125em;
		background: var(--muted);
		padding: 0.15em 0.4em;
		border-radius: 0.25rem;
	}
</style>
