// src/routes/(admin)/admin/panel/+page.server.ts

import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	// The (admin)/admin/+layout.server.ts already verified the role — safe to load.
	// Build the tenant matrix: each tenant row includes its resolved feature flags.
	const allTenants = db.tenants.all();

	return {
		tenants: allTenants.map((t) => ({
			id: t.id,
			name: t.name,
			slug: t.slug,
			plan: t.plan,
			features: db.features.forTenant(t.id)
		}))
	};
};
