// src/routes/(admin)/admin/members/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, tenant } = locals;

	// Superadmins see all tenants at /admin/panel, not a single tenant's members
	if (session?.role === 'superadmin') {
		redirect(303, '/admin/panel');
	}

	const members = db.users.forTenant(tenant!.id);
	const features = db.features.forTenant(tenant!.id);

	return {
		tenant: {
			name: tenant!.name,
			slug: tenant!.slug,
			plan: tenant!.plan,
			features
		},
		members: members.map((u) => ({
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role
		}))
	};
};
