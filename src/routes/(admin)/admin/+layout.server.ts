// src/routes/(admin)/+layout.server.ts

import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, tenant } = locals;

	if (!session) {
		redirect(303, '/login');
	}

	// Hard gate — members get 403, not a redirect
	if (!['admin', 'owner', 'superadmin'].includes(session.role)) {
		error(403, 'You need admin or owner role to access this area.');
	}

	const isSuperAdmin = session.role === 'superadmin';

	if (isSuperAdmin) {
		// Platform-level view: counts across all customer tenants
		return {
			adminStats: {
				totalTenants: db.tenants.customer().length,
				totalUsers: db.users.allCustomer().length,
				activeSessions: 1,
				tenantName: 'Platform',
				isSuperAdmin: true
			}
		};
	}

	// Tenant-scoped view: counts for this tenant only
	const memberCount = db.users.forTenant(tenant!.id).length;

	return {
		adminStats: {
			totalTenants: 1,
			totalUsers: memberCount,
			activeSessions: 1,
			tenantName: tenant?.name ?? 'Unknown',
			isSuperAdmin: false
		}
	};
};
