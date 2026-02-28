<script lang="ts">
	import RequireFeature from '$lib/components/RequireFeature.svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import { Activity, FileText, Plug, Users } from 'lucide-svelte';
	import type { Features, Tenant, Theme } from '$lib/types/context';
	import { getContext } from 'svelte';

	interface Props {
		data: {
			stats: { users: number; sessions: number; apiCalls: number; documents: number };
		};
	}

	let { data }: Props = $props();

	const theme = getContext<Theme>('theme');
	const tenantCtx = getContext<{ readonly current: Tenant }>('tenant');
	const featuresCtx = getContext<{ readonly current: Features }>('features');

	const tenant = $derived(tenantCtx.current);
	const features = $derived(featuresCtx.current);
</script>

<svelte:head>
	<title>Dashboard — {tenant.name}</title>
</svelte:head>

<div class="dashboard">
	<header class="page-header">
		<h1 style:color={theme.colors.primary}>{tenant.name}</h1>
		<div class="header-chips">
			<span class="chip">plan: <strong>{tenant.plan}</strong></span>
			<span class="chip"
				>primary: <code style:color={theme.colors.primary}>{theme.colors.primary}</code></span
			>
		</div>
	</header>

	<!-- Stats grid — some cards only appear with the right features -->
	<div class="stats-grid">
		<StatsCard title="Active Users" value={data.stats.users} icon={Users} />
		<StatsCard title="Live Sessions" value={data.stats.sessions} icon={Activity} />

		<RequireFeature feature="apiAccess">
			<StatsCard
				title="API Calls"
				value={data.stats.apiCalls.toLocaleString()}
				icon={Plug}
				note="last 30 days"
			/>
		</RequireFeature>

		<RequireFeature feature="advancedReporting">
			<StatsCard title="Documents" value={data.stats.documents} icon={FileText} />
		</RequireFeature>
	</div>

	<!-- Feature flags -->
	<section class="card">
		<div class="card-header">
			<div>
				<h2>Available Features</h2>
				<p class="card-desc">
					Resolved from the in-memory DB for tenant <code>{tenant.id}</code> (plan: {tenant.plan}).
					Context distributes them — no prop drilling.
				</p>
			</div>
		</div>
		<div class="feature-list">
			{#each Object.entries(features) as [key, enabled]}
				<div class="feature-row" class:enabled>
					<span
						class="feature-dot"
						style:background={enabled ? theme.colors.primary : 'var(--border)'}
					></span>
					<code class="feature-key">{key}</code>
					<span
						class="feature-badge"
						class:badge-enabled={enabled}
						style:background={enabled
							? `color-mix(in srgb, ${theme.colors.primary} 12%, transparent)`
							: ''}
						style:color={enabled ? theme.colors.primary : ''}
					>
						{enabled ? 'Enabled' : 'Disabled'}
					</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Context layer explainer -->
	<section class="card">
		<h2>Context layers active on this page</h2>
		<p class="card-desc">How the theme is resolved through nested context providers.</p>
		<ol class="explainer-list">
			<li>
				<strong>Root +layout.svelte</strong> set <code>theme</code> to the default indigo palette,
				<code>appConfig</code>, and <code>session</code>.
			</li>
			<li>
				<strong>(app)/+layout.svelte</strong> shadowed <code>theme</code> with tenant branding
				(primary: <code style:color={theme.colors.primary}>{theme.colors.primary}</code>), and set
				<code>tenant</code> and <code>features</code>.
			</li>
			<li>
				<strong>This page</strong> called <code>getContext('theme')</code> and got the tenant
				branding — not the default — because context shadowing resolves to the nearest ancestor.
			</li>
		</ol>
		<p class="explainer-note">
			Switch to <code>globex.localhost</code> for sky-blue or <code>initech.localhost</code> for
			emerald. Same components, different context values.
		</p>
	</section>
</div>

<style>
	.dashboard {
		max-width: 880px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.04em;
	}

	.header-chips {
		display: flex;
		gap: 0.5rem;
	}

	.chip {
		font-size: 0.8125rem;
		color: var(--muted-foreground);
		background: var(--card);
		border: 1px solid var(--border);
		padding: 0.2rem 0.625rem;
		border-radius: var(--radius-sm);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	/* Cards */
	.card {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.card h2 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--foreground);
		margin-bottom: 0.25rem;
	}

	.card-desc {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		line-height: 1.5;
	}

	/* Feature flags */
	.feature-list {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.feature-row {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		color: var(--muted-foreground);
		transition: background 0.15s;
	}

	.feature-row:hover {
		background: var(--muted);
	}

	.feature-row.enabled {
		color: var(--foreground);
	}

	.feature-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		flex-shrink: 0;
		transition: background 0.2s;
	}

	.feature-key {
		flex: 1;
		font-size: 0.8125rem;
	}

	.feature-badge {
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		background: var(--muted);
		color: var(--muted-foreground);
		text-transform: capitalize;
	}

	/* Explainer */
	.explainer-list {
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
	}

	.explainer-list li {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		line-height: 1.6;
	}

	.explainer-note {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		padding-top: 0.5rem;
		border-top: 1px solid var(--border);
		line-height: 1.6;
	}
</style>
