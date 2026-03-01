<script lang="ts">
	import { Building2, Hexagon, Rocket, Shield, Zap } from 'lucide-svelte';
	import type { TenantIconName } from '$lib/types/context';

	interface Props {
		icon: TenantIconName | string;
		size?: number;
	}

	let { icon, size = 24 }: Props = $props();
</script>

{#if icon === 'rocket'}
	<Rocket {size} />
{:else if icon === 'zap'}
	<Zap {size} />
{:else if icon === 'building2'}
	<Building2 {size} />
{:else if icon === 'shield'}
	<Shield {size} />
{:else}
	<Hexagon {size} />
{/if}
