<script lang="ts">
	import type { Features, Theme } from '$lib/types/context';
	import { getContext } from 'svelte';

	const theme = getContext<Theme>('theme');
	const featuresCtx = getContext<{ readonly current: Features }>('features');
	const features = $derived(featuresCtx.current);
</script>

<aside class="sidebar">
	<nav class="sidebar-nav">
		<div class="section-label">Main</div>
		<a href="/dashboard" class="nav-item" style:--primary={theme.colors.primary}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
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
			Dashboard
		</a>

		{#if features.advancedReporting}
			<a href="/dashboard" class="nav-item" style:--primary={theme.colors.primary}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg
				>
				Reports
			</a>
		{/if}

		{#if features.apiAccess}
			<a href="/dashboard" class="nav-item" style:--primary={theme.colors.primary}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg
				>
				API
			</a>
		{/if}

		<div class="section-label">Account</div>

		{#if features.customDomains}
			<a href="/dashboard" class="nav-item" style:--primary={theme.colors.primary}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path
					d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
				/></svg
				>
				Domains
			</a>
		{/if}

		<a href="/dashboard" class="nav-item" style:--primary={theme.colors.primary}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			><circle cx="12" cy="12" r="3" /><path
				d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"
			/></svg
			>
			Settings
		</a>
	</nav>

	{#if !features.prioritySupport}
		<div class="upgrade-nudge" style:--primary={theme.colors.primary}>
			<p class="nudge-title">Upgrade your plan</p>
			<p class="nudge-desc">Get priority support and more features.</p>
			<a href="/dashboard" class="nudge-link">Learn more →</a>
		</div>
	{/if}
</aside>

<style>
	.sidebar {
		width: 240px;
		flex-shrink: 0;
		background: var(--card);
		border-right: 1px solid var(--border);
		padding: 1rem 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.sidebar-nav {
		flex: 1;
		padding: 0 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.section-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted-foreground);
		padding: 0.5rem 0.625rem 0.25rem;
		margin-top: 0.5rem;
	}

	.section-label:first-child {
		margin-top: 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.4375rem 0.625rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--muted-foreground);
		border-radius: var(--radius-sm);
		transition: background 0.15s, color 0.15s;
	}

	.nav-item svg {
		flex-shrink: 0;
		opacity: 0.7;
	}

	.nav-item:hover {
		background: color-mix(in srgb, var(--primary) 8%, transparent);
		color: var(--primary);
	}

	.nav-item:hover svg {
		opacity: 1;
	}

	.upgrade-nudge {
		margin: 0.75rem 0.75rem 0.25rem;
		padding: 0.875rem 1rem;
		background: color-mix(in srgb, var(--primary) 6%, transparent);
		border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
		border-radius: var(--radius);
	}

	.nudge-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--foreground);
		margin-bottom: 0.25rem;
	}

	.nudge-desc {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		margin-bottom: 0.5rem;
	}

	.nudge-link {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--primary);
	}
</style>
