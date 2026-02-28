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

export type TenantIconName = 'rocket' | 'zap' | 'building2';

export interface Tenant {
	id: string;
	slug: string;
	name: string;
	branding: {
		logoIcon: TenantIconName;
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
