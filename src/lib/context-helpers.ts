// src/lib/context-helpers.ts
import { getContext } from 'svelte';
import type { Features, Tenant, Theme } from '$lib/types/context';

// Theme is set as a plain object with getter properties for reactive colors.
// The object reference itself is stable — getContext returns it directly.
export const getTheme = () => getContext<Theme>('theme');

// All other context values use the getter-object pattern because they derive
// from $props(). Call .current in the component and wrap with $derived so
// Svelte tracks the dependency correctly.
export const getTenantCtx = () => getContext<{ readonly current: Tenant }>('tenant');
export const getFeaturesCtx = () => getContext<{ readonly current: Features }>('features');
export const getSessionCtx = () => getContext<{ readonly current: UserSession | null }>('session');
export const getAppConfigCtx = () => getContext<{ readonly current: AppConfig }>('appConfig');
