// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Authenticated users have nothing to do here — send them to the dashboard
	if (locals.session) {
		redirect(303, '/dashboard');
	}

	// locals.tenant is always set by the hook — the landing page is tenant-aware
	// even though it's public. Visiting acme.localhost shows Acme branding;
	// visiting globex.localhost shows Globex branding.
	//
	// IMPORTANT: we must read url.searchParams here so SvelteKit knows this
	// load function depends on the ?tenant= param. Without this, SvelteKit
	// skips re-running the function on same-route client-side navigation
	// (e.g. clicking a tenant card), and the hero stays stale.
	url.searchParams.get('tenant');

	return {
		tenant: locals.tenant
	};
};
