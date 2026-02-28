// src/lib/types/context.ts

export interface AppConfig {
	name: string;
	version: string;
	environment: string;
}

export interface Theme {
	mode: 'light' | 'dark';
	colors: {
		primary: string;
		accent: string;
		background: string;
		surface: string;
		border: string;
		text: string;
		textMuted: string;
	};
}

export interface Tenant {
	id: string;
	slug: string;
	name: string;
	branding: {
		logoEmoji: string; // emoji used as logo in this demo (no image hosting needed)
		primaryColor: string; // CSS color string
		accentColor: string;
	};
	plan: 'free' | 'pro' | 'enterprise';
}

export interface Features {
	advancedReporting: boolean;
	apiAccess: boolean;
	customDomains: boolean;
	prioritySupport: boolean;
	whiteLabeling: boolean;
}

export interface UserSession {
	userId: string;
	name: string;
	email: string;
	role: 'member' | 'admin' | 'owner';
	tenantId: string;
}
