<!-- src/lib/components/StatsCard.svelte -->
<script lang="ts">
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types/context';

	interface Props {
		title: string;
		value: string | number;
		icon?: string;
		note?: string;
	}

	let { title, value, icon = '📌', note }: Props = $props();
	const theme = getContext<Theme>('theme');
</script>

<div class="stat-card" style:border-color={theme.colors.border}>
	<div class="stat-header">
		<span class="stat-icon">{icon}</span>
		<span class="stat-title">{title}</span>
	</div>
	<div class="stat-value" style:color={theme.colors.primary}>{value}</div>
	{#if note}<div class="stat-note">{note}</div>{/if}
</div>

<style>
	.stat-card {
		background: white;
		border: 1px solid;
		border-radius: 0.75rem;
		padding: 1.25rem;
	}

	.stat-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.stat-icon {
		font-size: 1.2rem;
	}
	.stat-title {
		font-size: 0.8rem;
		font-weight: 500;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1;
	}
	.stat-note {
		font-size: 0.75rem;
		color: #94a3b8;
		margin-top: 0.4rem;
	}
</style>
