<!-- src/routes/(admin)/+layout.svelte -->
<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import AdminNav from '$lib/components/AdminNav.svelte';
	import type { Theme } from '$lib/types/context';

	interface Props {
		data: {
			adminStats: {
				totalTenants: number;
				totalUsers: number;
				activeSessions: number;
				tenantName: string;
			};
		};
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Get the tenant-branded theme from (app)/+layout.svelte
	const tenantTheme = getContext<Theme>('theme');

	// Shadow it with dark mode — preserving tenant brand colors
	// Any component inside (admin)/* gets this theme, not the tenant one
	const adminTheme: Theme = {
		mode: 'dark',
		colors: {
			primary: tenantTheme.colors.primary, // Keep tenant brand
			accent: tenantTheme.colors.accent, // Keep tenant brand
			background: '#0f172a',
			surface: '#1e293b',
			border: '#334155',
			text: '#f1f5f9',
			textMuted: '#94a3b8'
		}
	};

	setContext<Theme>('theme', adminTheme);
	// TODO: fix warning about this context being set in a layout — it's needed for the admin nav stats, but maybe there's a better way to do this without the warning? Maybe move it to a +page.svelte and pass it down as props instead?
	setContext('adminStats', data.adminStats);
</script>

<div
	class="admin-shell"
	style:background={adminTheme.colors.background}
	style:color={adminTheme.colors.text}
>
	<AdminNav stats={data.adminStats} />
	<main class="admin-content">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
	}

	.admin-content {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}
</style>
