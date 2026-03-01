// src/routes/(app)/+layout.server.ts

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { tenant, session } = locals;

	if (!session || !tenant) {
		redirect(303, '/login');
	}

	// Load feature flags from DB — never compute entitlements client-side
	const features = db.features.forTenant(tenant.id);

	return {
		tenant, // Full Tenant object including branding
		features // Feature flags resolved for this tenant
	};
};
