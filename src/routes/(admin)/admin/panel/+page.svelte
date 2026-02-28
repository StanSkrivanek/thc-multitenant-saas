<script lang="ts">
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types/context';
	import type { Features } from '$lib/types/context';

	interface TenantRow {
		id: string;
		name: string;
		slug: string;
		plan: string;
		features: Features;
	}

	interface Props {
		data: { tenants: TenantRow[] };
	}

	let { data }: Props = $props();

	// Gets the DARK admin theme because (admin)/+layout.svelte shadowed 'theme' with adminTheme.
	const theme = getContext<Theme>('theme');

	const featureKeys: (keyof Features)[] = [
		'advancedReporting',
		'apiAccess',
		'customDomains',
		'prioritySupport',
		'whiteLabeling'
	];

	// Short labels for the feature columns
	const featureLabels: Record<keyof Features, string> = {
		advancedReporting: 'Reports',
		apiAccess: 'API',
		customDomains: 'Domains',
		prioritySupport: 'Support',
		whiteLabeling: 'White-label'
	};
</script>

<svelte:head>
	<title>Admin Panel</title>
</svelte:head>

<div class="panel">
	<div class="page-header">
		<h1 style:color={theme.colors.text}>All Tenants</h1>
		<p style:color={theme.colors.textMuted}>
			Viewing all tenants in the system. Theme mode:
			<code style:color={theme.colors.primary}>{theme.mode}</code> — shadowed by the admin layout.
		</p>
	</div>

	<div class="tenant-table" style:border-color={theme.colors.border}>
		<div
			class="table-head"
			style:background={theme.colors.surface}
			style:color={theme.colors.textMuted}
		>
			<span>Tenant</span>
			<span>Plan</span>
			{#each featureKeys as key}
				<span class="feat-col">{featureLabels[key]}</span>
			{/each}
		</div>

		{#each data.tenants as tenant}
			<div
				class="table-row"
				style:border-top-color={theme.colors.border}
				style:--hover-bg={theme.colors.surface}
			>
				<div class="tenant-info">
					<div class="tenant-name" style:color={theme.colors.text}>{tenant.name}</div>
					<div class="tenant-slug" style:color={theme.colors.textMuted}>
						<code>{tenant.slug}.localhost</code>
					</div>
				</div>
				<div>
					<span
						class="plan-chip"
						class:enterprise={tenant.plan === 'enterprise'}
						class:pro={tenant.plan === 'pro'}
						class:free={tenant.plan === 'free'}
						style:background={tenant.plan === 'enterprise'
							? theme.colors.primary
							: tenant.plan === 'pro'
								? theme.colors.accent
								: theme.colors.border}
					>
						{tenant.plan}
					</span>
				</div>
				{#each featureKeys as key}
					<div class="feat-cell" style:color={theme.colors.textMuted}>
						{#if tenant.features[key]}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								style:color={theme.colors.primary}
								><polyline points="20 6 9 17 4 12" /></svg
							>
						{:else}
							<span class="feat-dash">—</span>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div
		class="context-note"
		style:background={theme.colors.surface}
		style:border-color={theme.colors.border}
	>
		<h2 style:color={theme.colors.text}>Context Shadowing in Action</h2>
		<p style:color={theme.colors.textMuted}>
			The dashboard at <code>/dashboard</code> uses the <strong style:color={theme.colors.text}
				>tenant-branded theme</strong
			> (light mode). This admin panel uses the
			<strong style:color={theme.colors.text}>dark admin theme</strong> — same component, same
			<code>getContext('theme')</code> call, different value because
			<code>(admin)/+layout.svelte</code> shadows the tenant theme with a dark palette while preserving
			primary and accent colors.
		</p>
		<p style:color={theme.colors.textMuted}>
			Context shadowing creates clean, composable layering without global state. No prop threading.
			No store imports. Just <code>setContext</code> + <code>getContext</code>.
		</p>
	</div>
</div>

<style>
	.panel {
		max-width: 960px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.04em;
		margin-bottom: 0.375rem;
	}

	.page-header p {
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.tenant-table {
		border: 1px solid;
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-size: 0.875rem;
	}

	.table-head,
	.table-row {
		display: grid;
		grid-template-columns: 2fr 1fr repeat(5, 1fr);
		align-items: center;
		padding: 0.625rem 1rem;
		gap: 0.5rem;
	}

	.table-head {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.table-row {
		border-top: 1px solid;
		transition: background 0.15s;
	}

	.table-row:hover {
		background: var(--hover-bg);
	}

	.tenant-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.tenant-name {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.tenant-slug {
		font-size: 0.75rem;
	}

	.plan-chip {
		display: inline-flex;
		align-items: center;
		font-size: 0.625rem;
		font-weight: 700;
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.feat-col {
		font-size: 0.6875rem;
		text-align: center;
	}

	.feat-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.feat-dash {
		font-size: 0.75rem;
		opacity: 0.4;
	}

	.context-note {
		border: 1px solid;
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.context-note h2 {
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.context-note p {
		font-size: 0.875rem;
		line-height: 1.6;
	}
</style>
