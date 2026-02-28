<script lang="ts">
	import RequireFeature from '$lib/components/RequireFeature.svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
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
		<div>
			<h1 style:color={theme.colors.primary}>{tenant.name} Dashboard</h1>
			<p style:color={theme.colors.textMuted}>
				Plan: <strong>{tenant.plan}</strong> · Theme primary:
				<code style:color={theme.colors.primary}>{theme.colors.primary}</code>
			</p>
		</div>
	</header>

	<!-- Stats grid — some cards only appear with the right features -->
	<div class="stats-grid">
		<StatsCard title="Active Users" value={data.stats.users} icon="👥" />
		<StatsCard title="Live Sessions" value={data.stats.sessions} icon="🟢" />

		<RequireFeature feature="apiAccess">
			<StatsCard
				title="API Calls"
				value={data.stats.apiCalls.toLocaleString()}
				icon="🔌"
				note="last 30 days"
			/>
		</RequireFeature>

		<RequireFeature feature="advancedReporting">
			<StatsCard title="Documents" value={data.stats.documents} icon="📄" />
		</RequireFeature>
	</div>

	<!-- Feature showcase section -->
	<section class="features-section">
		<h2>Available Features</h2>
		<p style:color={theme.colors.textMuted}>
			These are resolved from the in-memory DB for tenant <code>{tenant.id}</code> (plan: {tenant.plan}).
			Context distributes them — no prop drilling required.
		</p>

		<div class="feature-grid">
			{#each Object.entries(features) as [key, enabled]}
				<div class="feature-row" class:enabled>
					<span class="feature-dot" style:background={enabled ? theme.colors.primary : '#cbd5e1'}
					></span>
					<code class="feature-key">{key}</code>
					<span class="feature-status">{enabled ? 'Enabled' : 'Disabled'}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Context layer explainer -->
	<section class="explainer">
		<h2>Context layers active on this page</h2>
		<ol>
			<li>
				<strong>Root +layout.svelte</strong> set <code>theme</code> to the default indigo palette,
				<code>appConfig</code>, and <code>session</code>.
			</li>
			<li>
				<strong>(app)/+layout.svelte</strong> shadowed <code>theme</code> with tenant branding
				(primary: <code style:color={theme.colors.primary}>{theme.colors.primary}</code>), and set
				<code>tenant</code>
				and <code>features</code>.
			</li>
			<li>
				<strong>This page</strong> called <code>getContext('theme')</code> and got the tenant branding
				— not the default — because context shadowing always resolves to the nearest ancestor provider.
			</li>
		</ol>
		<p>
			Switch to <code>globex.localhost</code> and you'll get sky-blue; switch to
			<code>initech.localhost</code> and you'll get emerald. Same components, different context values.
		</p>
	</section>
</div>

<style>
	.dashboard {
		max-width: 860px;
	}

	.page-header {
		margin-bottom: 2rem;
	}
	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.features-section,
	.explainer {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.features-section h2,
	.explainer h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	.feature-grid {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 1rem;
	}

	.feature-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.feature-row.enabled {
		color: #1e293b;
	}

	.feature-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.feature-key {
		font-size: 0.8rem;
	}
	.feature-status {
		font-size: 0.75rem;
		margin-left: auto;
	}

	.explainer ol {
		padding-left: 1.25rem;
	}
	.explainer li {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		color: #475569;
	}
</style>
