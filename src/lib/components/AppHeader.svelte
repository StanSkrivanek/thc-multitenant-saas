<!-- src/lib/components/AppHeader.svelte -->
<script lang="ts">
	import { getContext } from 'svelte';
	import type { Tenant, Theme, UserSession } from '$lib/types/context';

	const theme = getContext<Theme>('theme');
	const tenantCtx = getContext<{ readonly current: Tenant }>('tenant');
	const session = getContext<UserSession | null>('session');

	// .current dereferences the getter — always returns the live tenant value
	const tenant = $derived(tenantCtx.current);
</script>

<header class="app-header" style:border-bottom-color={theme.colors.border}>
	<div class="brand">
		<span class="logo">{tenant.branding.logoEmoji}</span>
		<span class="tenant-name">{tenant.name}</span>
		<span class="plan-badge" style:background={theme.colors.primary}>
			{tenant.plan}
		</span>
	</div>

	<nav class="nav-links">
		<a href="/dashboard">Dashboard</a>
		{#if session?.role === 'admin' || session?.role === 'owner'}
			<a href="/admin/panel" class="admin-link" style:color={theme.colors.accent}> Admin Panel </a>
		{/if}
	</nav>

	<div class="user-area">
		{#if session}
			<div class="user-pill">
				<span class="avatar" style:background={theme.colors.primary}>
					{session.name.charAt(0).toUpperCase()}
				</span>
				<div class="user-info">
					<span class="user-name">{session.name}</span>
					<span class="user-role">{session.role}</span>
				</div>
			</div>
			<form method="POST" action="/logout">
				<button type="submit" class="logout-btn">Sign out</button>
			</form>
		{/if}
	</div>
</header>

<style>
	.app-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0 1.5rem;
		height: 3.5rem;
		background: white;
		border-bottom: 1px solid;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.logo {
		font-size: 1.5rem;
	}
	.tenant-name {
		font-weight: 700;
		font-size: 1rem;
	}

	.plan-badge {
		font-size: 0.65rem;
		font-weight: 700;
		color: white;
		padding: 0.1rem 0.5rem;
		border-radius: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		flex: 1;
	}

	.nav-links a {
		font-size: 0.875rem;
		text-decoration: none;
		color: #475569;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.nav-links a:hover {
		background: #f1f5f9;
	}
	.admin-link {
		font-weight: 600 !important;
	}

	.user-area {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
	}

	.user-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.user-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1e293b;
	}
	.user-role {
		font-size: 0.7rem;
		color: #94a3b8;
		text-transform: capitalize;
	}

	.logout-btn {
		background: none;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		padding: 0.3rem 0.75rem;
		font-size: 0.8rem;
		cursor: pointer;
		color: #475569;
	}

	.logout-btn:hover {
		background: #f8fafc;
	}
</style>
