// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Authenticated users have nothing to do here — send them to the dashboard
	if (locals.session) {
		redirect(303, '/dashboard');
	}

	// locals.tenant is always set by the hook — the landing page is tenant-aware
	// even though it's public. Visiting acme.localhost shows Acme branding;
	// visiting globex.localhost shows Globex branding.
	return {
		tenant: locals.tenant
	};
};
