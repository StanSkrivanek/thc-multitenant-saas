<script lang="ts">
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types/context';
	import type { Features } from '$lib/types/context';

	interface Member {
		id: string;
		name: string;
		email: string;
		role: 'member' | 'admin' | 'owner';
	}

	interface Props {
		data: {
			tenant: {
				name: string;
				slug: string;
				plan: 'free' | 'pro' | 'enterprise';
				features: Features;
			};
			members: Member[];
		};
	}

	let { data }: Props = $props();

	const theme = getContext<Theme>('theme');

	const featureKeys: (keyof Features)[] = [
		'advancedReporting',
		'apiAccess',
		'customDomains',
		'prioritySupport',
		'whiteLabeling'
	];

	const featureLabels: Record<keyof Features, string> = {
		advancedReporting: 'Reports',
		apiAccess: 'API',
		customDomains: 'Domains',
		prioritySupport: 'Support',
		whiteLabeling: 'White-label'
	};
</script>

<svelte:head>
	<title>Members — {data.tenant.name}</title>
</svelte:head>

<div class="panel">
	<div class="page-header">
		<h1 style:color={theme.colors.text}>{data.tenant.name}</h1>
		<p style:color={theme.colors.textMuted}>Members and plan details for your tenant.</p>
	</div>

	<!-- Plan + features card -->
	<div
		class="plan-card"
		style:background={theme.colors.surface}
		style:border-color={theme.colors.border}
	>
		<div class="plan-row">
			<span style:color={theme.colors.textMuted}>Plan</span>
			<span
				class="plan-chip"
				class:enterprise={data.tenant.plan === 'enterprise'}
				class:pro={data.tenant.plan === 'pro'}
				class:free={data.tenant.plan === 'free'}
				style:background={data.tenant.plan === 'enterprise'
					? theme.colors.primary
					: data.tenant.plan === 'pro'
						? theme.colors.accent
						: theme.colors.border}
			>
				{data.tenant.plan}
			</span>
		</div>
		<div class="features-row" style:border-top-color={theme.colors.primary}>
			{#each featureKeys as key}
				<div class="feature-pill" style:color={theme.colors.textMuted}>
					{#if data.tenant.features[key]}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							style:color={theme.colors.primary}><polyline points="20 6 9 17 4 12" /></svg
						>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							style:color={theme.colors.border}
							><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
						>
					{/if}
					<span
						style:color={data.tenant.features[key] ? theme.colors.text : theme.colors.textMuted}
					>
						{featureLabels[key]}
					</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Members table -->
	<div class="members-table" style:border-color={theme.colors.border}>
		<div
			class="table-head"
			style:background={theme.colors.surface}
			style:color={theme.colors.textMuted}
		>
			<span>Name</span>
			<span>Email</span>
			<span>Role</span>
		</div>

		{#each data.members as member}
			<div
				class="table-row"
				style:border-top-color={theme.colors.border}
				style:--hover-bg={theme.colors.surface}
			>
				<div class="member-name" style:color={theme.colors.text}>{member.name}</div>
				<div class="member-email" style:color={theme.colors.textMuted}>{member.email}</div>
				<span
					class="role-chip"
					class:role-owner={member.role === 'owner'}
					class:role-admin={member.role === 'admin'}
					class:role-member={member.role === 'member'}
					style:background={member.role === 'owner'
						? theme.colors.primary
						: member.role === 'admin'
							? theme.colors.accent
							: theme.colors.border}
				>
					{member.role}
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.panel {
		max-width: 720px;
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

	/* Plan card */
	.plan-card {
		border: 1px solid;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.plan-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1rem;
		font-size: 0.875rem;
	}

	.plan-chip,
	.role-chip {
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

	.features-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid;
	}

	.feature-pill {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.75rem;
	}

	/* Members table */
	.members-table {
		border: 1px solid;
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-size: 0.875rem;
	}

	.table-head,
	.table-row {
		display: grid;
		grid-template-columns: 1.5fr 2fr 0.75fr;
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

	.member-name {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.member-email {
		font-size: 0.8125rem;
	}
</style>
