<script lang="ts">
	import { getContext } from 'svelte';
	import type { ComponentType, SvelteComponent } from 'svelte';
	import type { Theme } from '$lib/types/context';

	interface Props {
		title: string;
		value: string | number;
		icon?: ComponentType<SvelteComponent>;
		note?: string;
	}

	let { title, value, icon: IconComponent, note }: Props = $props();
	const theme = getContext<Theme>('theme');
</script>

<div class="stat-card">
	<div class="stat-header">
		<span class="stat-title">{title}</span>
		{#if IconComponent}
			<span class="stat-icon"><IconComponent size={16} /></span>
		{/if}
	</div>
	<div class="stat-value" style:color={theme.colors.primary}>{value}</div>
	{#if note}<p class="stat-note">{note}</p>{/if}
</div>

<style>
	.stat-card {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.25rem 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	.stat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.875rem;
	}

	.stat-title {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--muted-foreground);
		letter-spacing: 0.01em;
	}

	.stat-icon {
		display: flex;
		align-items: center;
		color: var(--muted-foreground);
		opacity: 0.6;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.stat-note {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		margin-top: 0.375rem;
	}
</style>
