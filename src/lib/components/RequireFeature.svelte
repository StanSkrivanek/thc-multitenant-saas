<!-- src/lib/components/RequireFeature.svelte -->
<script lang="ts">
	import { getContext } from 'svelte';
	import type { Features } from '$lib/types/context';

	interface Props {
		feature: keyof Features;
		fallback?: import('svelte').Snippet;
		children: import('svelte').Snippet;
	}

	let { feature, fallback, children }: Props = $props();

	const featuresCtx = getContext<{ readonly current: Features }>('features');
	const hasFeature = $derived(featuresCtx.current[feature]);
</script>

{#if hasFeature}
	{@render children()}
{:else if fallback}
	{@render fallback()}
{/if}
