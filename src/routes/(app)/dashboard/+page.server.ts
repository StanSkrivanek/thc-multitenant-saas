// src/routes/(app)/dashboard/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) redirect(303, '/login');

	// In a real app: query DB for this tenant's stats
	// We return plausible mock numbers here
	return {
		stats: {
			users: 12,
			sessions: 3,
			apiCalls: 14_823,
			documents: 47
		}
	};
};
