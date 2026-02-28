import type { Tenant, UserSession } from '$lib/types/context';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/**
			 * The resolved tenant for this request.
			 * Set by hooks.server.ts based on subdomain (or ?tenant= in dev).
			 * null when no matching tenant is found.
			 */
			tenant: Tenant | null;

			/**
			 * The authenticated user session, or null if unauthenticated.
			 * Set by hooks.server.ts after validating the session cookie.
			 */
			session: UserSession | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
