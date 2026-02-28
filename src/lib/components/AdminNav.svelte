<script lang="ts">
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types/context';

	interface Props {
		stats: { totalTenants: number; totalUsers: number; activeSessions: number; tenantName: string };
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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			style:color={theme.colors.primary}
			><path
				d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
			/></svg
		>
		<span style:color={theme.colors.text}>Admin Panel</span>
	</div>

	<div class="stats-grid" style:border-color={theme.colors.border}>
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

	<nav class="admin-nav-links">
		<a
			href="/dashboard"
			class="nav-link"
			style:color={theme.colors.textMuted}
			style:--hover-bg={theme.colors.border}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg
			>
			Dashboard
		</a>

		<div class="nav-divider" style:background={theme.colors.border}></div>

		<a
			href="/admin/panel"
			class="nav-link"
			style:color={theme.colors.textMuted}
			style:--hover-bg={theme.colors.border}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect
					x="14"
					y="14"
					width="7"
					height="7"
				/><rect x="3" y="14" width="7" height="7" /></svg
			>
			Overview
		</a>
	</nav>

	<div
		class="tenant-badge"
		style:border-color={theme.colors.border}
		style:color={theme.colors.textMuted}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg
		>
		Viewing: <strong style:color={theme.colors.text}>{stats.tenantName}</strong>
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
