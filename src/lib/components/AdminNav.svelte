<!-- src/lib/components/AdminNav.svelte -->
<script lang="ts">
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types/context';

	interface Props {
		stats: { totalTenants: number; totalUsers: number; activeSessions: number; tenantName: string };
	}

	let { stats }: Props = $props();
	const theme = getContext<Theme>('theme');

	// Alternatively, AdminNav could read adminStats directly from context
	// via getContext<{ readonly current: ... }>('adminStats').current
	// but receiving it as a prop from the layout keeps the component
	// decoupled from the context key name — easier to test in isolation.
</script>

<aside
	class="admin-nav"
	style:background={theme.colors.surface}
	style:border-right-color={theme.colors.border}
>
	<div class="admin-brand" style:color={theme.colors.primary}>🛡️ Admin Panel</div>

	<div class="admin-stats">
		<div class="mini-stat">
			<span class="mini-value" style:color={theme.colors.primary}>{stats.totalTenants}</span>
			<span class="mini-label" style:color={theme.colors.textMuted}>Tenants</span>
		</div>
		<div class="mini-stat">
			<span class="mini-value" style:color={theme.colors.primary}>{stats.totalUsers}</span>
			<span class="mini-label" style:color={theme.colors.textMuted}>Users</span>
		</div>
		<div class="mini-stat">
			<span class="mini-value" style:color={theme.colors.primary}>{stats.activeSessions}</span>
			<span class="mini-label" style:color={theme.colors.textMuted}>Sessions</span>
		</div>
	</div>

	<nav>
		<a
			href="/dashboard"
			class="admin-link back-link"
			style:color={theme.colors.textMuted}
			style:--hover-bg={theme.colors.border}
		>
			← Dashboard
		</a>
		<div class="nav-divider" style:background={theme.colors.border}></div>
		<a
			href="/admin/panel"
			class="admin-link"
			style:color={theme.colors.textMuted}
			style:--hover-bg={theme.colors.border}
		>
			📋 Overview
		</a>
	</nav>

	<div
		class="tenant-badge"
		style:border-color={theme.colors.border}
		style:color={theme.colors.textMuted}
	>
		Viewing: {stats.tenantName}
	</div>
</aside>

<style>
	.admin-nav {
		width: 220px;
		flex-shrink: 0;
		border-right: 1px solid;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem 0;
	}

	.admin-brand {
		font-weight: 700;
		font-size: 0.95rem;
		padding: 0 1.25rem;
	}

	.admin-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		padding: 0 1rem;
	}

	.mini-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.mini-value {
		font-size: 1.25rem;
		font-weight: 700;
	}
	.mini-label {
		font-size: 0.65rem;
		text-transform: uppercase;
	}

	.admin-link {
		display: block;
		padding: 0.5rem 1.25rem;
		font-size: 0.875rem;
		text-decoration: none;
	}

	.admin-link:hover {
		background: var(--hover-bg);
	}

	.tenant-badge {
		margin-top: auto;
		padding: 0.5rem 1.25rem;
		border-top: 1px solid;
		font-size: 0.75rem;
	}
</style>
