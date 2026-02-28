// src/lib/server/db.ts

import type { Features, Tenant, UserSession } from '$lib/types/context';

// ─── Internal shapes ────────────────────────────────────────────────────────

interface DBTenant {
	id: string;
	slug: string;
	name: string;
	plan: 'free' | 'pro' | 'enterprise';
	branding: {
		logoEmoji: string;
		primaryColor: string;
		accentColor: string;
	};
}

interface DBUser {
	id: string;
	tenantId: string;
	name: string;
	email: string;
	/** ⚠️ Demo only — plaintext comparison */
	password: string;
	role: 'member' | 'admin' | 'owner';
}

interface DBSession {
	token: string;
	userId: string;
	expiresAt: Date;
}

interface DBFeatureFlag {
	tenantId: string | null; // null = global default
	key: string;
	enabled: boolean;
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const tenants: DBTenant[] = [
	{
		id: 'tenant_acme',
		slug: 'acme',
		name: 'Acme Corp',
		plan: 'enterprise',
		branding: {
			logoEmoji: '🚀',
			primaryColor: '#ff6452', // indigo
			accentColor: '#ff7961'
		}
	},
	{
		id: 'tenant_globex',
		slug: 'globex',
		name: 'Globex Inc',
		plan: 'pro',
		branding: {
			logoEmoji: '⚡',
			primaryColor: '#0ec5e9', // sky blue
			accentColor: '#33a6e0'
		}
	},
	{
		id: 'tenant_initech',
		slug: 'initech',
		name: 'Initech LLC',
		plan: 'free',
		branding: {
			logoEmoji: '🏢',
			primaryColor: '#ff7ee1', // emerald
			accentColor: '#ff17bd'
		}
	}
];

const users: DBUser[] = [
	// Acme
	{
		id: 'user_alice',
		tenantId: 'tenant_acme',
		name: 'Alice Admin',
		email: 'alice@acme.com',
		password: 'password123',
		role: 'admin'
	},
	{
		id: 'user_bob',
		tenantId: 'tenant_acme',
		name: 'Bob Member',
		email: 'bob@acme.com',
		password: 'password123',
		role: 'member'
	},
	// Globex
	{
		id: 'user_carol',
		tenantId: 'tenant_globex',
		name: 'Carol Owner',
		email: 'carol@globex.com',
		password: 'password123',
		role: 'owner'
	},
	// Initech
	{
		id: 'user_dave',
		tenantId: 'tenant_initech',
		name: 'Dave Member',
		email: 'dave@initech.com',
		password: 'password123',
		role: 'member'
	}
];

/** Feature flags: null tenantId = global default; specific tenantId = override. */
const featureFlags: DBFeatureFlag[] = [
	// Global defaults (all tenants)
	{ tenantId: null, key: 'advancedReporting', enabled: false },
	{ tenantId: null, key: 'apiAccess', enabled: false },
	{ tenantId: null, key: 'customDomains', enabled: false },
	{ tenantId: null, key: 'prioritySupport', enabled: false },
	{ tenantId: null, key: 'whiteLabeling', enabled: false },

	// Acme (enterprise) — override everything on
	{ tenantId: 'tenant_acme', key: 'advancedReporting', enabled: true },
	{ tenantId: 'tenant_acme', key: 'apiAccess', enabled: true },
	{ tenantId: 'tenant_acme', key: 'customDomains', enabled: true },
	{ tenantId: 'tenant_acme', key: 'prioritySupport', enabled: true },
	{ tenantId: 'tenant_acme', key: 'whiteLabeling', enabled: true },

	// Globex (pro) — some features on
	{ tenantId: 'tenant_globex', key: 'advancedReporting', enabled: true },
	{ tenantId: 'tenant_globex', key: 'apiAccess', enabled: true },
	{ tenantId: 'tenant_globex', key: 'prioritySupport', enabled: true }
];

// Sessions created at runtime
const sessions: DBSession[] = [];

// ─── Public API ──────────────────────────────────────────────────────────────

import { randomBytes } from 'node:crypto';

function generateToken() {
	return randomBytes(32).toString('hex');
}

function resolveFeatureFlags(tenantId: string): Features {
	function resolve(key: string): boolean {
		// Tenant-specific override first
		const override = featureFlags.find((f) => f.tenantId === tenantId && f.key === key);
		if (override !== undefined) return override.enabled;
		// Fall back to global default
		const global = featureFlags.find((f) => f.tenantId === null && f.key === key);
		return global?.enabled ?? false;
	}

	return {
		advancedReporting: resolve('advancedReporting'),
		apiAccess: resolve('apiAccess'),
		customDomains: resolve('customDomains'),
		prioritySupport: resolve('prioritySupport'),
		whiteLabeling: resolve('whiteLabeling')
	};
}

export const db = {
	tenants: {
		findBySlug(slug: string): DBTenant | null {
			return tenants.find((t) => t.slug === slug) ?? null;
		},
		all(): DBTenant[] {
			return [...tenants];
		}
	},

	users: {
		authenticate(email: string, password: string): DBUser | null {
			const user = users.find(
				(u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
			);
			return user ?? null;
		},
		findById(id: string): DBUser | null {
			return users.find((u) => u.id === id) ?? null;
		}
	},

	sessions: {
		create(userId: string, ttlDays = 1): DBSession {
			const session: DBSession = {
				token: generateToken(),
				userId,
				expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000)
			};
			sessions.push(session);
			return session;
		},
		findByToken(token: string): DBSession | null {
			const s = sessions.find((s) => s.token === token);
			if (!s || s.expiresAt < new Date()) return null;
			return s;
		},
		deleteByToken(token: string): void {
			const i = sessions.findIndex((s) => s.token === token);
			if (i !== -1) sessions.splice(i, 1);
		}
	},

	features: {
		forTenant(tenantId: string): Features {
			return resolveFeatureFlags(tenantId);
		}
	}
};

/** Build a typed Tenant from a raw DB record. */
export function toPublicTenant(raw: ReturnType<typeof db.tenants.findBySlug>): Tenant {
	if (!raw) throw new Error('toPublicTenant: null input');
	return {
		id: raw.id,
		slug: raw.slug,
		name: raw.name,
		plan: raw.plan,
		branding: raw.branding
	};
}

/** Build a typed UserSession from a raw DB user. */
export function toSession(raw: ReturnType<typeof db.users.findById>): UserSession {
	if (!raw) throw new Error('toSession: null input');
	return {
		userId: raw.id,
		name: raw.name,
		email: raw.email,
		role: raw.role,
		tenantId: raw.tenantId
	};
}
