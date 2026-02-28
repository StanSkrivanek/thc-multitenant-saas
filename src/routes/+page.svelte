<script lang="ts">
	import type { Tenant } from '$lib/types/context';

	interface Props {
		data: { tenant: Tenant | null };
	}

	let { data }: Props = $props();

	// Each row maps a demo account to the URL it must be accessed from.
	// This is the single most important piece of information for anyone
	// following the article — cross-tenant login silently fails by design.
	const demoAccounts = [
		{
			email: 'alice@acme.com',
			role: 'admin',
			plan: 'enterprise',
			tenant: 'Acme Corp',
			slug: 'acme',
			emoji: '🚀',
			color: '#6366f1',
			url: 'http://localhost:5173?tenant=acme',
			subdomain: 'http://acme.localhost:5173'
		},
		{
			email: 'bob@acme.com',
			role: 'member',
			plan: 'enterprise',
			tenant: 'Acme Corp',
			slug: 'acme',
			emoji: '🚀',
			color: '#6366f1',
			url: 'http://localhost:5173?tenant=acme',
			subdomain: 'http://acme.localhost:5173'
		},
		{
			email: 'carol@globex.com',
			role: 'owner',
			plan: 'pro',
			tenant: 'Globex Inc',
			slug: 'globex',
			emoji: '⚡',
			color: '#0ea5e9',
			url: 'http://localhost:5173?tenant=globex',
			subdomain: 'http://globex.localhost:5173'
		},
		{
			email: 'dave@initech.com',
			role: 'member',
			plan: 'free',
			tenant: 'Initech LLC',
			slug: 'initech',
			emoji: '🏢',
			color: '#10b981',
			url: 'http://localhost:5173?tenant=initech',
			subdomain: 'http://initech.localhost:5173'
		}
	];

	const primaryColor = $derived(data.tenant?.branding.primaryColor ?? '#6366f1');
	const accentColor = $derived(data.tenant?.branding.accentColor ?? '#8b5cf6');
</script>

<svelte:head>
	<title>{data.tenant?.name ?? 'SaaS Demo'} — Context API Demo</title>
</svelte:head>

<div class="landing">
	<!-- Hero: immediately shows tenant branding in action -->
	<header class="hero" style:--primary={primaryColor} style:--accent={accentColor}>
		<div class="hero-badge">
			<span class="hero-emoji">{data.tenant?.branding.logoEmoji ?? '⬡'}</span>
			<div>
				<h1>{data.tenant?.name ?? 'SaaS Demo'}</h1>
				{#if data.tenant}
					<p class="hero-sub">
						Plan: <strong>{data.tenant.plan}</strong> · Primary:
						<code style:color={primaryColor}>{primaryColor}</code>
					</p>
				{/if}
			</div>
		</div>
		<p class="hero-desc">
			A complete multi-tenant SaaS demo built with SvelteKit and the Context API. Tenant branding,
			feature flags, and role-based admin — all from context, no prop drilling.
		</p>
		<a href="/login" class="cta" style:background={primaryColor}>Sign in →</a>
	</header>

	<!-- Tenant isolation explainer -->
	<section class="section">
		<h2>Each tenant is a separate world</h2>
		<p>
			The URL determines which tenant you're on. The server hook reads the subdomain (or <code
				>?tenant=</code
			> param) and isolates all data, branding, and feature flags before any load function runs. You can
			only log in with an account that belongs to the current tenant — cross-tenant credentials are silently
			rejected.
		</p>
		<div class="tenants-grid">
			<a href="http://localhost:5173?tenant=acme" class="tenant-card" style:--color="#6366f1">
				<span class="t-emoji">🚀</span>
				<div class="t-info">
					<strong>Acme Corp</strong>
					<span>enterprise · indigo</span>
					<code>?tenant=acme</code>
				</div>
			</a>
			<a href="http://localhost:5173?tenant=globex" class="tenant-card" style:--color="#0ea5e9">
				<span class="t-emoji">⚡</span>
				<div class="t-info">
					<strong>Globex Inc</strong>
					<span>pro · sky blue</span>
					<code>?tenant=globex</code>
				</div>
			</a>
			<a href="http://localhost:5173?tenant=initech" class="tenant-card" style:--color="#10b981">
				<span class="t-emoji">🏢</span>
				<div class="t-info">
					<strong>Initech LLC</strong>
					<span>free · emerald</span>
					<code>?tenant=initech</code>
				</div>
			</a>
		</div>
	</section>

	<!-- Demo accounts with correct URLs -->
	<section class="section">
		<h2>Demo accounts</h2>
		<p>
			All passwords are <code>password123</code>. Each account must be accessed from its tenant's
			URL — the tenant column links directly to the correct address.
		</p>
		<div class="accounts-table">
			<div class="accounts-header">
				<span>Email</span>
				<span>Role</span>
				<span>Tenant</span>
				<span>URL to use</span>
			</div>
			{#each demoAccounts as account}
				<div class="account-row">
					<code class="account-email">{account.email}</code>
					<span class="role-badge" style:background={account.color}>{account.role}</span>
					<span class="account-tenant">
						<span>{account.emoji}</span>
						<span>{account.tenant}</span>
					</span>
					<div class="account-urls">
						<a href={account.url} class="url-link" style:color={account.color}>
							{account.url}
						</a>
						<span class="url-sep">or</span>
						<a href={account.subdomain} class="url-link url-subdomain" style:color={account.color}>
							{account.subdomain}
						</a>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Subdomain setup hint -->
	<section class="section hint-section">
		<h2>Subdomain setup (optional)</h2>
		<p>
			The <code>?tenant=</code> query param works out of the box. To use real subdomains locally,
			add these lines to <code>/etc/hosts</code> and restart your browser:
		</p>
		<pre class="code-block">127.0.0.1  acme.localhost
127.0.0.1  globex.localhost
127.0.0.1  initech.localhost</pre>
		<p>Then visit <code>http://acme.localhost:5173</code> directly — no query param needed.</p>
	</section>
</div>

<style>
	.landing {
		max-width: 860px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	/* Hero */
	.hero {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 1rem;
		padding: 2rem;
		border-top: 4px solid var(--primary);
	}

	.hero-badge {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.hero-emoji {
		font-size: 2.5rem;
		line-height: 1;
	}

	.hero-badge h1 {
		font-size: 1.75rem;
		font-weight: 800;
		margin: 0;
		color: var(--primary);
	}

	.hero-sub {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: #64748b;
	}

	.hero-desc {
		font-size: 0.95rem;
		color: #475569;
		margin: 0 0 1.5rem;
		max-width: 600px;
		line-height: 1.6;
	}

	.cta {
		display: inline-block;
		padding: 0.65rem 1.5rem;
		color: white;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.cta:hover {
		opacity: 0.85;
	}

	/* Sections */
	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section h2 {
		font-size: 1.1rem;
		font-weight: 700;
		margin: 0;
		color: #1e293b;
	}

	.section p {
		font-size: 0.9rem;
		color: #475569;
		margin: 0;
		line-height: 1.6;
	}

	/* Tenant cards */
	.tenants-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.tenant-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-left: 3px solid var(--color);
		border-radius: 0.5rem;
		padding: 0.875rem 1rem;
		text-decoration: none;
		transition: box-shadow 0.15s;
	}

	.tenant-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.t-emoji {
		font-size: 1.5rem;
	}

	.t-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.t-info strong {
		font-size: 0.875rem;
		color: #1e293b;
	}
	.t-info span {
		font-size: 0.75rem;
		color: #64748b;
	}
	.t-info code {
		font-size: 0.72rem;
		color: var(--color);
		background: #f8fafc;
		padding: 0.1rem 0.3rem;
		border-radius: 0.2rem;
	}

	/* Accounts table */
	.accounts-table {
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		overflow: hidden;
		font-size: 0.85rem;
	}

	.accounts-header {
		display: grid;
		grid-template-columns: 2fr 1fr 1.25fr 2.5fr;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		background: #f8fafc;
		color: #94a3b8;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.account-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1.25fr 2.5fr;
		gap: 0.5rem;
		align-items: center;
		padding: 0.65rem 1rem;
		border-top: 1px solid #e2e8f0;
	}

	.account-email {
		color: #334155;
		font-size: 0.8rem;
	}

	.role-badge {
		display: inline-block;
		font-size: 0.68rem;
		font-weight: 700;
		color: white;
		padding: 0.1rem 0.45rem;
		border-radius: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.account-tenant {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
		color: #475569;
	}

	.account-urls {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.url-link {
		font-size: 0.75rem;
		font-family: monospace;
		text-decoration: none;
	}

	.url-link:hover {
		text-decoration: underline;
	}

	.url-sep {
		font-size: 0.65rem;
		color: #cbd5e1;
	}

	.url-subdomain {
		color: inherit;
		opacity: 0.7;
	}

	/* Hint section */
	.hint-section {
		background: #fffbeb;
		border: 1px solid #fde68a;
		border-radius: 0.75rem;
		padding: 1.25rem 1.5rem;
	}

	.code-block {
		background: #1e293b;
		color: #e2e8f0;
		padding: 0.875rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.82rem;
		line-height: 1.7;
		margin: 0;
		overflow-x: auto;
	}
</style>
