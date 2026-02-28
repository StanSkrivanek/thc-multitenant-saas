// src/routes/(admin)/+layout.server.ts

import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, tenant } = locals;

	if (!session) {
		redirect(303, '/login');
	}

	// Hard gate — non-admins get 403, not a redirect
	if (session.role !== 'admin' && session.role !== 'owner') {
		error(403, 'You need admin or owner role to access this area.');
	}

	// Admin-only stats
	const allTenants = db.tenants.all();

	return {
		adminStats: {
			totalTenants: allTenants.length,
			totalUsers: 4, // Would be db.users.count() in production
			activeSessions: 1, // Would query sessions in production
			tenantName: tenant?.name ?? 'Unknown'
		}
	};
};
