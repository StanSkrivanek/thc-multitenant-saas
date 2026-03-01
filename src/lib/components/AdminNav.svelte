<script lang="ts">
	import { ArrowLeft, LayoutDashboard, Shield, Users, User } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types/context';

	interface Props {
		stats: {
			totalTenants: number;
			totalUsers: number;
			activeSessions: number;
			tenantName: string;
			isSuperAdmin: boolean;
		};
	}

	let { stats }: Props = $props();
	const theme = getContext<Theme>('theme');
</script>

<aside
	class="admin-nav"
	style:background={theme.colors.surface}
	style:border-right-color={theme.colors.border}
>
	<div class="admin-brand">
		<Shield size={16} color={theme.colors.primary} />
		<span style:color={theme.colors.text}>Admin Panel</span>
	</div>

	<div
		class="stats-grid"
		class:two-col={!stats.isSuperAdmin}
		style:border-color={theme.colors.border}
	>
		{#if stats.isSuperAdmin}
			<div class="mini-stat">
				<span class="mini-value" style:color={theme.colors.primary}>{stats.totalTenants}</span>
				<span class="mini-label" style:color={theme.colors.textMuted}>Tenants</span>
			</div>
		{/if}
		<div class="mini-stat">
			<span class="mini-value" style:color={theme.colors.primary}>{stats.totalUsers}</span>
			<span class="mini-label" style:color={theme.colors.textMuted}>
				{stats.isSuperAdmin ? 'Users' : 'Members'}
			</span>
		</div>
		<div class="mini-stat">
			<span class="mini-value" style:color={theme.colors.primary}>{stats.activeSessions}</span>
			<span class="mini-label" style:color={theme.colors.textMuted}>Sessions</span>
		</div>
	</div>

	<nav class="admin-nav-links">
		{#if !stats.isSuperAdmin}
			<a
				href="/dashboard"
				class="nav-link"
				style:color={theme.colors.textMuted}
				style:--hover-bg={theme.colors.border}
			>
				<ArrowLeft size={14} />
				Dashboard
			</a>
		{/if}

		<div class="nav-divider" style:background={theme.colors.border}></div>

		{#if stats.isSuperAdmin}
			<a
				href="/admin/panel"
				class="nav-link"
				style:color={theme.colors.textMuted}
				style:--hover-bg={theme.colors.border}
			>
				<LayoutDashboard size={14} />
				All Tenants
			</a>
		{:else}
			<a
				href="/admin/members"
				class="nav-link"
				style:color={theme.colors.textMuted}
				style:--hover-bg={theme.colors.border}
			>
				<Users size={14} />
				Members
			</a>
		{/if}
	</nav>

	<div
		class="tenant-badge"
		style:border-color={theme.colors.border}
		style:color={theme.colors.textMuted}
	>
		<User size={12} />
		{#if stats.isSuperAdmin}
			<strong style:color={theme.colors.text}>Platform Admin</strong>
		{:else}
			Viewing: <strong style:color={theme.colors.text}>{stats.tenantName}</strong>
		{/if}
	</div>
</aside>

<style>
	.admin-nav {
		width: 240px;
		flex-shrink: 0;
		border-right: 1px solid;
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 1.5rem 0;
	}

	.admin-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 0.875rem;
		padding: 0 1.25rem 1.25rem;
		letter-spacing: -0.01em;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
		padding: 1rem 1rem 1.25rem;
		border-top: 1px solid;
		border-bottom: 1px solid;
		margin-bottom: 0.75rem;
	}

	.stats-grid.two-col {
		grid-template-columns: repeat(2, 1fr);
	}

	.mini-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
	}

	.mini-value {
		font-size: 1.375rem;
		font-weight: 700;
		letter-spacing: -0.04em;
	}

	.mini-label {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.admin-nav-links {
		flex: 1;
		padding: 0 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.4375rem 0.625rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius-sm);
		transition: background 0.15s, color 0.15s;
	}

	.nav-link:hover {
		background: var(--hover-bg);
	}

	.nav-divider {
		height: 1px;
		margin: 0.375rem 0.625rem;
	}

	.tenant-badge {
		margin-top: auto;
		padding: 0.75rem 1.25rem;
		border-top: 1px solid;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
</style>
