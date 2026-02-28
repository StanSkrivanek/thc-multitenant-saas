// src/routes/+layout.server.ts

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Routes that guests can access without logging in
const PUBLIC_PATHS = ['/login'];

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { tenant, session } = locals;

	// Redirect to login for protected routes
	const isPublic = PUBLIC_PATHS.some((p) => url.pathname.startsWith(p));
	if (!session && !isPublic) {
		const returnUrl = encodeURIComponent(url.pathname + url.search);
		redirect(303, `/login?returnUrl=${returnUrl}`);
	}

	return {
		appConfig: {
			name: 'SaaS Demo',
			version: '1.0.0',
			environment: process.env.NODE_ENV ?? 'development'
		},
		// Pass minimal session data to the client
		session: session
			? { userId: session.userId, name: session.name, email: session.email, role: session.role }
			: null,
		// Pass tenant slug so the app layout can load the full tenant
		tenantSlug: tenant?.slug ?? null
	};
};
