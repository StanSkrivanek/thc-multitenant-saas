<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
	// TODO:  Step 10 - reference to components that do not exist yet - will be added in later steps. Ignore errors for now.
	import { getContext, setContext } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import type { Features, Tenant, Theme } from '$lib/types/context';

	interface Props {
		data: { tenant: Tenant; features: Features };
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Set tenant and features — consumed by dashboard pages
	setContext<Tenant>('tenant', data.tenant);
	setContext<Features>('features', data.features);

	// Get the default theme from the root layout
	const defaultTheme = getContext<Theme>('theme');

	// Build a tenant-branded theme — same 'theme' key, shadowed value
	// Any component in (app)/* that calls getContext('theme') gets this,
	// NOT the root default.
	const tenantTheme: Theme = {
		...defaultTheme,
		colors: {
			...defaultTheme.colors,
			primary: data.tenant.branding.primaryColor,
			accent: data.tenant.branding.accentColor
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
		background: #f8fafc;
	}

	.app-body {
		display: flex;
		flex: 1;
	}

	.app-content {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}
</style>
