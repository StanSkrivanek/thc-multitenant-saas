<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import type { Features, Tenant, Theme } from '$lib/types/context';

	interface Props {
		data: { tenant: Tenant; features: Features };
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Set tenant and features using getter objects so context always reflects
	// the *current* value of data — not only the initial snapshot.
	//
	// Why getters? data comes from $props(), which is reactive. Reading
	// data.tenant directly at the top-level script body — outside any reactive
	// context — means Svelte can only capture the value once at initialization.
	// If SvelteKit re-runs the load function (e.g. after invalidateAll() or a
	// form action), data updates but the context value would silently stay stale.
	//
	// Wrapping each read in a getter closure defers the access to call time.
	// Svelte tracks the dependency correctly, and consumers always get the
	// live value via .current.
	setContext<{ readonly current: Tenant }>('tenant', {
		get current() {
			return data.tenant;
		}
	});
	setContext<{ readonly current: Features }>('features', {
		get current() {
			return data.features;
		}
	});

	// Get the default theme from the root layout
	const defaultTheme = getContext<Theme>('theme');

	// Build a tenant-branded theme — same 'theme' key, shadowed value.
	// Any component in (app)/* that calls getContext('theme') gets this,
	// NOT the root default.
	//
	// Branding colors also use getters so the theme stays in sync if data
	// updates after SvelteKit invalidation.
	const tenantTheme: Theme = {
		...defaultTheme,
		colors: {
			...defaultTheme.colors,
			// Updated zinc-based neutral palette
			background: '#ffffff',
			surface: '#f4f4f5',
			border: '#e4e4e7',
			text: '#09090b',
			textMuted: '#71717a',
			get primary() {
				return data.tenant.branding.primaryColor;
			},
			get accent() {
				return data.tenant.branding.accentColor;
			}
		}
	};

	setContext<Theme>('theme', tenantTheme);
</script>

<div class="app-shell">
	<AppHeader />

	<div class="app-body">
		<AppSidebar />
		<main class="app-content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--muted);
	}

	.app-body {
		display: flex;
		flex: 1;
	}

	.app-content {
		flex: 1;
		padding: 2rem 2.5rem;
		overflow-y: auto;
		min-width: 0;
	}
</style>
