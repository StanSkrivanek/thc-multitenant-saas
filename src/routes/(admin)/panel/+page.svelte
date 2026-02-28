<!-- src/routes/(admin)/panel/+page.svelte -->
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

	// This getContext call gets the DARK admin theme — not the tenant theme —
	// because (admin)/+layout.svelte shadowed 'theme' with adminTheme.
	const theme = getContext<Theme>('theme');

	const featureKeys: (keyof Features)[] = [
		'advancedReporting',
		'apiAccess',
		'customDomains',
		'prioritySupport',
		'whiteLabeling'
	];
</script>

<svelte:head>
	<title>Admin Panel</title>
</svelte:head>

<div class="panel">
	<h1 style:color={theme.colors.text}>All Tenants</h1>
	<p style:color={theme.colors.textMuted}>
		Viewing all tenants in the system. Theme mode: <code>{theme.mode}</code>
		(shadowed to dark by the admin layout — same <code>'theme'</code> context key, different value).
	</p>

	<div class="tenant-table" style:border-color={theme.colors.border}>
		<div
			class="table-header"
			style:background={theme.colors.surface}
			style:color={theme.colors.textMuted}
		>
			<span>Tenant</span>
			<span>Plan</span>
			{#each featureKeys as key}
				<span class="feature-col">{key}</span>
			{/each}
		</div>

		{#each data.tenants as tenant}
			<div class="table-row" style:border-top-color={theme.colors.border}>
				<div>
					<div class="tenant-name" style:color={theme.colors.text}>{tenant.name}</div>
					<div class="tenant-slug" style:color={theme.colors.textMuted}>
						<code>{tenant.slug}.localhost</code>
					</div>
				</div>
				<div>
					<span
						class="plan-chip"
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
					<div class="feature-cell">
						{tenant.features[key] ? '✅' : '—'}
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
			The dashboard at <code>/dashboard</code> uses the <strong>tenant-branded theme</strong> (light
			mode, tenant colors). This admin panel uses the <strong>dark admin theme</strong> — same
			component, same <code>getContext('theme')</code> call, different value because
			<code>(admin)/+layout.svelte</code> shadows the tenant theme with a dark palette while preserving
			the tenant's primary and accent colors.
		</p>
		<p style:color={theme.colors.textMuted}>
			Context shadowing creates clean, composable layering without global state. No prop threading.
			No store imports. Just <code>setContext</code> + <code>getContext</code>.
		</p>
	</div>
</div>

<style>
	.panel {
		max-width: 900px;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
	}

	.tenant-table {
		border: 1px solid;
		border-radius: 0.75rem;
		overflow: hidden;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}

	.table-header,
	.table-row {
		display: grid;
		grid-template-columns: 2fr 1fr repeat(5, 1fr);
		align-items: center;
		padding: 0.75rem 1rem;
		gap: 0.5rem;
	}

	.table-header {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.table-row {
		border-top: 1px solid;
	}

	.tenant-name {
		font-weight: 600;
	}
	.tenant-slug {
		font-size: 0.75rem;
	}

	.plan-chip {
		font-size: 0.7rem;
		font-weight: 700;
		color: white;
		padding: 0.15rem 0.5rem;
		border-radius: 1rem;
		text-transform: uppercase;
	}

	.feature-cell {
		text-align: center;
		font-size: 1rem;
	}
	.feature-col {
		font-size: 0.65rem;
		text-align: center;
	}

	.context-note {
		border: 1px solid;
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.context-note h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.75rem;
	}
	.context-note p {
		font-size: 0.875rem;
		margin: 0 0 0.5rem;
	}
</style>
