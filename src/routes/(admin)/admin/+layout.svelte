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
				isSuperAdmin: boolean;
			};
		};
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Get the tenant-branded theme from (app)/+layout.svelte
	const tenantTheme = getContext<Theme>('theme');

	// Derive adminStats so the prop reference stays reactive.
	// AdminNav receives this as a prop — if data re-runs after an admin
	// action, the prop passed to AdminNav will reflect the fresh value.
	const adminStats = $derived(data.adminStats);

	// Shadow it with dark mode — preserving tenant brand colors
	// Any component inside (admin)/* gets this theme, not the tenant one
	const adminTheme: Theme = {
		mode: 'dark',
		colors: {
			primary: tenantTheme.colors.primary, // Keep tenant brand
			accent: tenantTheme.colors.accent, // Keep tenant brand
			background: '#09090b', // zinc-950
			surface: '#18181b', // zinc-900
			border: '#27272a', // zinc-800
			text: '#fafafa', // zinc-50
			textMuted: '#a1a1aa' // zinc-400
		}
	};

	setContext<Theme>('theme', adminTheme);

	// Getter wrapper for the same reason as tenant and features in (app)/+layout.svelte:
	// data is reactive ($props), reading data.adminStats directly at init captures
	// only the initial snapshot. The getter defers the read so any re-run of the
	// admin load function (e.g. after an admin action invalidates the route) is
	// automatically reflected in every consumer via .current.
	setContext<{ readonly current: typeof data.adminStats }>('adminStats', {
		get current() {
			return data.adminStats;
		}
	});
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
		padding: 2rem 2.5rem;
		overflow-y: auto;
		min-width: 0;
	}
</style>
