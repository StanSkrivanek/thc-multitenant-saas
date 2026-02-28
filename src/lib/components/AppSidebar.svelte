<!-- src/lib/components/AppSidebar.svelte -->
<script lang="ts">
	import type { Features, Theme } from '$lib/types/context';
	import { getContext } from 'svelte';

	const theme = getContext<Theme>('theme');
	const featuresCtx = getContext<{ readonly current: Features }>('features');
	const features = $derived(featuresCtx.current);
</script>

<aside class="sidebar" style:border-right-color={theme.colors.border}>
	<nav>
		<div class="section-label">Main</div>
		<a href="/dashboard" class="nav-item" style:--color={theme.colors.primary}> 📊 Dashboard </a>

		{#if features.advancedReporting}
			<a href="/dashboard" class="nav-item" style:--color={theme.colors.primary}> 📈 Reports </a>
		{/if}

		{#if features.apiAccess}
			<a href="/dashboard" class="nav-item" style:--color={theme.colors.primary}> 🔌 API </a>
		{/if}

		<div class="section-label">Account</div>

		{#if features.customDomains}
			<a href="/dashboard" class="nav-item" style:--color={theme.colors.primary}> 🌐 Domains </a>
		{/if}

		<a href="/dashboard" class="nav-item" style:--color={theme.colors.primary}> ⚙️ Settings </a>
	</nav>

	{#if !features.prioritySupport}
		<div class="upgrade-nudge" style:border-color={theme.colors.primary}>
			<p>Upgrade for priority support</p>
			<a href="/dashboard" style:color={theme.colors.primary}>Learn more →</a>
		</div>
	{/if}
</aside>

<style>
	.sidebar {
		width: 220px;
		flex-shrink: 0;
		background: white;
		border-right: 1px solid;
		padding: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	nav {
		flex: 1;
	}

	.section-label {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #94a3b8;
		padding: 0.25rem 1rem;
		margin-top: 0.5rem;
	}

	.nav-item {
		display: block;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		text-decoration: none;
		color: #475569;
		border-radius: 0;
	}

	.nav-item:hover {
		background: color-mix(in srgb, var(--color) 10%, transparent);
		color: var(--color);
	}

	.upgrade-nudge {
		margin: 0 0.75rem;
		padding: 0.75rem;
		border: 1px solid;
		border-radius: 0.5rem;
		font-size: 0.8rem;
		color: #64748b;
	}

	.upgrade-nudge p {
		margin: 0 0 0.25rem;
	}
	.upgrade-nudge a {
		font-weight: 600;
		text-decoration: none;
	}
</style>
