// src/lib/server/db.ts

import type { Features, Tenant, TenantIconName, UserSession } from '$lib/types/context';

// ─── Internal shapes ────────────────────────────────────────────────────────

interface DBTenant {
	id: string;
	slug: string;
	name: string;
	plan: 'free' | 'pro' | 'enterprise';
	branding: {
		logoIcon: TenantIconName;
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
	role: 'member' | 'admin' | 'owner' | 'superadmin';
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
	// ── Platform (internal — not a customer tenant) ───────────────────────────
	{
		id: 'tenant_platform',
		slug: 'platform',
		name: 'SaaS Platform',
		plan: 'enterprise',
		branding: {
			logoIcon: 'shield',
			primaryColor: '#6366f1',
			accentColor: '#818cf8'
		}
	},
	// ── Customer tenants ──────────────────────────────────────────────────────
	{
		id: 'tenant_acme',
		slug: 'acme',
		name: 'Acme Corp',
		plan: 'enterprise',
		branding: {
			logoIcon: 'rocket',
			primaryColor: '#ff6452',
			accentColor: '#ff7961'
		}
	},
	{
		id: 'tenant_globex',
		slug: 'globex',
		name: 'Globex Inc',
		plan: 'pro',
		branding: {
			logoIcon: 'zap',
			primaryColor: '#0ec5e9',
			accentColor: '#33a6e0'
		}
	},
	{
		id: 'tenant_initech',
		slug: 'initech',
		name: 'Initech LLC',
		plan: 'free',
		branding: {
			logoIcon: 'building2',
			primaryColor: '#ff7ee1',
			accentColor: '#ff17bd'
		}
	}
];

const users: DBUser[] = [
	// ── Platform superadmin ───────────────────────────────────────────────────
	{
		id: 'user_superadmin',
		tenantId: 'tenant_platform',
		name: 'Platform Admin',
		email: 'admin@platform.com',
		password: 'password123',
		role: 'superadmin'
	},
	// ── Acme Corp (enterprise) ────────────────────────────────────────────────
	{
		id: 'user_alice',
		tenantId: 'tenant_acme',
		name: 'Alice Anderson',
		email: 'alice@acme.com',
		password: 'password123',
		role: 'owner'
	},
	{
		id: 'user_bob',
		tenantId: 'tenant_acme',
		name: 'Bob Baker',
		email: 'bob@acme.com',
		password: 'password123',
		role: 'member'
	},
	{
		id: 'user_charlie',
		tenantId: 'tenant_acme',
		name: 'Charlie Chen',
		email: 'charlie@acme.com',
		password: 'password123',
		role: 'member'
	},
	{
		id: 'user_diana',
		tenantId: 'tenant_acme',
		name: 'Diana Patel',
		email: 'diana@acme.com',
		password: 'password123',
		role: 'member'
	},
	{
		id: 'user_ethan',
		tenantId: 'tenant_acme',
		name: 'Ethan Moore',
		email: 'ethan@acme.com',
		password: 'password123',
		role: 'member'
	},
	{
		id: 'user_fiona',
		tenantId: 'tenant_acme',
		name: 'Fiona Liu',
		email: 'fiona@acme.com',
		password: 'password123',
		role: 'member'
	},
	// ── Globex Inc (pro) ──────────────────────────────────────────────────────
	{
		id: 'user_carol',
		tenantId: 'tenant_globex',
		name: 'Carol Owen',
		email: 'carol@globex.com',
		password: 'password123',
		role: 'owner'
	},
	{
		id: 'user_george',
		tenantId: 'tenant_globex',
		name: 'George Walsh',
		email: 'george@globex.com',
		password: 'password123',
		role: 'admin'
	},
	{
		id: 'user_hannah',
		tenantId: 'tenant_globex',
		name: 'Hannah Brooks',
		email: 'hannah@globex.com',
		password: 'password123',
		role: 'member'
	},
	{
		id: 'user_ivan',
		tenantId: 'tenant_globex',
		name: 'Ivan Reyes',
		email: 'ivan@globex.com',
		password: 'password123',
		role: 'member'
	},
	// ── Initech LLC (free) ────────────────────────────────────────────────────
	{
		id: 'user_dave',
		tenantId: 'tenant_initech',
		name: 'Dave Nguyen',
		email: 'dave@initech.com',
		password: 'password123',
		role: 'owner'
	},
	{
		id: 'user_judy',
		tenantId: 'tenant_initech',
		name: 'Judy Kim',
		email: 'judy@initech.com',
		password: 'password123',
		role: 'admin'
	},
	{
		id: 'user_kevin',
		tenantId: 'tenant_initech',
		name: 'Kevin Scott',
		email: 'kevin@initech.com',
		password: 'password123',
		role: 'member'
	},
	{
		id: 'user_laura',
		tenantId: 'tenant_initech',
		name: 'Laura Stone',
		email: 'laura@initech.com',
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
		/** All tenants including the internal platform tenant. */
		all(): DBTenant[] {
			return [...tenants];
		},
		/** Customer tenants only — excludes the internal platform tenant. */
		customer(): DBTenant[] {
			return tenants.filter((t) => t.id !== 'tenant_platform');
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
		},
		/** All users belonging to a specific tenant. */
		forTenant(tenantId: string): DBUser[] {
			return users.filter((u) => u.tenantId === tenantId);
		},
		/** All customer users — excludes platform superadmins. */
		allCustomer(): DBUser[] {
			return users.filter((u) => u.tenantId !== 'tenant_platform');
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
