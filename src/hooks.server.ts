// src/hooks.server.ts

import type { Handle } from '@sveltejs/kit';
import { db, toPublicTenant, toSession } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	const host = event.request.headers.get('host') ?? '';

	// ── 1. Resolve tenant from subdomain ───────────────────────────────────────
	//
	// Production:  acme.yourapp.com  → slug = 'acme'
	// Development: acme.localhost    → slug = 'acme'
	// Fallback:    localhost:5173    → read ?tenant= query param, or 'acme' as demo default

	const tenantSlug = resolveTenantSlug(host, event.url);

	const rawTenant = db.tenants.findBySlug(tenantSlug);

	if (!rawTenant) {
		// Unknown tenant — return plain 404 (no HTML layout needed)
		return new Response(`Tenant "${tenantSlug}" not found.`, { status: 404 });
	}

	event.locals.tenant = toPublicTenant(rawTenant);

	// ── 2. Validate session ───────────────────────────────────────────────────
	const sessionToken = event.cookies.get('session');

	if (sessionToken) {
		const dbSession = db.sessions.findByToken(sessionToken);

		if (dbSession) {
			const rawUser = db.users.findById(dbSession.userId);

			if (rawUser && rawUser.tenantId === rawTenant.id) {
				// User must belong to this tenant — no cross-tenant access
				event.locals.session = toSession(rawUser);
			} else {
				// Stale or cross-tenant session — clear it
				db.sessions.deleteByToken(sessionToken);
				event.cookies.delete('session', { path: '/' });
				event.locals.session = null;
			}
		} else {
			// Expired or invalid token — clear the cookie
			event.cookies.delete('session', { path: '/' });
			event.locals.session = null;
		}
	} else {
		event.locals.session = null;
	}

	return resolve(event);
};

function resolveTenantSlug(host: string, url: URL): string {
	// Strip port number
	const hostname = host.split(':')[0];

	// Single-label host (plain 'localhost') — use query param or demo default
	if (!hostname.includes('.')) {
		return url.searchParams.get('tenant') ?? 'acme';
	}

	// Multi-label: first segment is the subdomain (acme.localhost, acme.yourapp.com)
	const subdomain = hostname.split('.')[0];

	// Treat 'www' and 'app' as marketing / auth subdomains — no tenant
	if (subdomain === 'www' || subdomain === 'app') {
		return url.searchParams.get('tenant') ?? 'acme';
	}

	return subdomain;
}
