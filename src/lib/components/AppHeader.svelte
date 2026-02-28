<script lang="ts">
	import { getContext } from 'svelte';
	import type { Tenant, Theme, UserSession } from '$lib/types/context';

	const theme = getContext<Theme>('theme');
	const tenantCtx = getContext<{ readonly current: Tenant }>('tenant');
	const sessionCtx = getContext<{ readonly current: UserSession | null }>('session');

	const tenant = $derived(tenantCtx.current);
	const session = $derived(sessionCtx.current);
</script>

<header class="app-header">
	<div class="brand">
		<span class="logo-emoji">{tenant.branding.logoEmoji}</span>
		<span class="tenant-name">{tenant.name}</span>
		<span class="plan-badge" style:background={theme.colors.primary}>{tenant.plan}</span>
	</div>

	<nav class="nav-links">
		<a href="/dashboard" class="nav-link">Dashboard</a>
		{#if session?.role === 'admin' || session?.role === 'owner'}
			<a href="/admin/panel" class="nav-link nav-link-admin" style:color={theme.colors.accent}>
				Admin Panel
			</a>
		{/if}
	</nav>

	<div class="user-area">
		{#if session}
			<div class="user-pill">
				<span class="avatar" style:background={theme.colors.primary}>
					{session.name.charAt(0).toUpperCase()}
				</span>
				<div class="user-meta">
					<span class="user-name">{session.name}</span>
					<span class="user-role">{session.role}</span>
				</div>
			</div>
			<form method="POST" action="/logout">
				<button type="submit" class="btn-ghost">Sign out</button>
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
		background: var(--card);
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		z-index: 10;
		box-shadow: var(--shadow-sm);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.logo-emoji {
		font-size: 1.25rem;
		line-height: 1;
	}

	.tenant-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--foreground);
		letter-spacing: -0.01em;
	}

	.plan-badge {
		font-size: 0.625rem;
		font-weight: 600;
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.nav-links {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}

	.nav-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--muted-foreground);
		padding: 0.375rem 0.625rem;
		border-radius: var(--radius-sm);
		transition: background 0.15s, color 0.15s;
	}

	.nav-link:hover {
		background: var(--muted);
		color: var(--foreground);
	}

	.nav-link-admin {
		font-weight: 600;
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
		gap: 0.625rem;
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
		font-size: 0.8125rem;
		flex-shrink: 0;
	}

	.user-meta {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.user-name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--foreground);
	}

	.user-role {
		font-size: 0.6875rem;
		color: var(--muted-foreground);
		text-transform: capitalize;
	}

	.btn-ghost {
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.3125rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		color: var(--muted-foreground);
		transition: background 0.15s, color 0.15s;
		font-family: inherit;
	}

	.btn-ghost:hover {
		background: var(--muted);
		color: var(--foreground);
	}
</style>
