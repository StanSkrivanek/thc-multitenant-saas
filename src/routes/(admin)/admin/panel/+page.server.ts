// src/routes/(admin)/admin/panel/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = locals;

	// Only the platform superadmin sees all tenants — tenant admins go to /admin/members
	if (session?.role !== 'superadmin') {
		redirect(303, '/admin/members');
	}

	const customerTenants = db.tenants.customer();

	return {
		tenants: customerTenants.map((t) => ({
			id: t.id,
			name: t.name,
			slug: t.slug,
			plan: t.plan,
			features: db.features.forTenant(t.id)
		}))
	};
};
