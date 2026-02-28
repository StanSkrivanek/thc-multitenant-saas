// src/lib/context-helpers.ts
import { getContext } from 'svelte';
import type { Features, Tenant, Theme } from '$lib/types/context';

// Theme is set directly (no getter wrapper needed — plain object)
export const getTheme = () => getContext<Theme>('theme');

// Tenant and Features use the getter-object pattern.
// These helpers return the wrapper — call .current in the component
// so $derived can track the live value reactively.
export const getTenantCtx = () => getContext<{ readonly current: Tenant }>('tenant');
export const getFeaturesCtx = () => getContext<{ readonly current: Features }>('features');
