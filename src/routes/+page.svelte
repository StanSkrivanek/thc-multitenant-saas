<script lang="ts">
	import type { Tenant } from '$lib/types/context';

	interface Props {
		data: { tenant: Tenant | null };
	}

	let { data }: Props = $props();

	const demoAccounts = [
		{
			email: 'alice@acme.com',
			role: 'admin',
			tenant: 'Acme Corp',
			emoji: '🚀',
			color: '#ff6452',
			url: 'http://localhost:5173?tenant=acme',
			subdomain: 'http://acme.localhost:5173'
		},
		{
			email: 'bob@acme.com',
			role: 'member',
			tenant: 'Acme Corp',
			emoji: '🚀',
			color: '#ff6452',
			url: 'http://localhost:5173?tenant=acme',
			subdomain: 'http://acme.localhost:5173'
		},
		{
			email: 'carol@globex.com',
			role: 'owner',
			tenant: 'Globex Inc',
			emoji: '⚡',
			color: '#0ec5e9',
			url: 'http://localhost:5173?tenant=globex',
			subdomain: 'http://globex.localhost:5173'
		},
		{
			email: 'dave@initech.com',
			role: 'member',
			tenant: 'Initech LLC',
			emoji: '🏢',
			color: '#ff7ee1',
			url: 'http://localhost:5173?tenant=initech',
			subdomain: 'http://initech.localhost:5173'
		}
	];

	const primaryColor = $derived(data.tenant?.branding.primaryColor ?? '#ff6452');

	// When a tenant is active, send the user to their subdomain login page so
	// cross-tenant isolation works correctly from the very first click.
	const loginUrl = $derived(
		data.tenant ? `http://${data.tenant.slug}.localhost:5173/login` : '/login'
	);
</script>

<svelte:head>
	<title>{data.tenant?.name ?? 'SaaS Demo'} — Context API Demo</title>
</svelte:head>

<div class="page">
	<!-- Hero -->

	<section class="lead-hero">
		<h1>Multi-tenant SaaS with Svelte 5 Context API</h1>
		<p>
			A fully working multi-tenant SaaS demo built with SvelteKit and the Context API. Tenant
			branding, feature flags, and role-based admin — all from context, no prop drilling.
		</p>
	</section>
	<section
		class="hero"
		style:--primary="{primaryColor},"
		style:background="color-mix(in srgb, {primaryColor} 15%, transparent)"
	>
		<!-- <div class="hero-eyebrow">
			<span class="badge">Multi-Tenant SaaS Demo</span>
		</div> -->
		<div class="hero-brand">
			<span class="hero-emoji">{data.tenant?.branding.logoEmoji ?? '⬡'}</span>
			<h1 style:color={primaryColor}>{data.tenant?.name ?? 'SaaS Demo'}</h1>
		</div>
		{#if data.tenant}
			<div class="hero-chips">
				<span class="chip">plan: <strong>{data.tenant.plan}</strong></span>
				<span class="chip">primary: <code style:color={primaryColor}>{primaryColor}</code></span>
			</div>
		{/if}
		<p class="hero-desc">
			Each tenant has its own isolated data, branding, and feature flags determined by the URL. Sign
			in to see the magic!
		</p>
		<a href={loginUrl} class="btn-primary" style:background={primaryColor}>Sign in →</a>
	</section>

	<!-- Tenants -->
	<section class="card-section">
		<div class="section-header">
			<h2>Each tenant is a separate world</h2>
			<p>
				The URL determines which tenant you’re on. The server hook reads the subdomain (or <code
					>?tenant=</code
				> param) and isolates all data, branding, and feature flags before any load function runs.
			</p>
		</div>
		<div class="tenants-grid">
			<a href="http://localhost:5173?tenant=acme" class="tenant-card" style:--color="#ff6452">
				<span class="t-emoji">🚀</span>
				<div class="t-info">
					<strong>Acme Corp</strong>
					<span>enterprise · indigo</span>
					<code>?tenant=acme</code>
				</div>
			</a>
			<a href="http://localhost:5173?tenant=globex" class="tenant-card" style:--color="#0ec5e9">
				<span class="t-emoji">⚡</span>
				<div class="t-info">
					<strong>Globex Inc</strong>
					<span>pro · sky blue</span>
					<code>?tenant=globex</code>
				</div>
			</a>
			<a href="http://localhost:5173?tenant=initech" class="tenant-card" style:--color="#ff7ee1">
				<span class="t-emoji">🏢</span>
				<div class="t-info">
					<strong>Initech LLC</strong>
					<span>free · emerald</span>
					<code>?tenant=initech</code>
				</div>
			</a>
		</div>
	</section>

	<!-- Demo accounts -->
	<section class="card-section">
		<div class="section-header">
			<h2>Demo accounts</h2>
			<p>
				All passwords are <code>password123</code>. Each account must be accessed from its tenant’s
				URL — cross-tenant credentials are silently rejected.
			</p>
		</div>
		<div class="accounts-table">
			<div class="table-head">
				<span>Email</span>
				<span>Role</span>
				<span>Tenant</span>
				<span>URL to use</span>
			</div>
			{#each demoAccounts as account}
				<div class="table-row">
					<code class="email-cell">{account.email}</code>
					<span class="role-badge" style:background={account.color}>{account.role}</span>
					<span class="tenant-cell">
						<span>{account.emoji}</span>
						<span>{account.tenant}</span>
					</span>
					<div class="url-cell">
						<a href={account.url} class="url-link" style:color={account.color}>
							{account.url}
						</a>
						<span class="url-sep">or</span>
						<a href={account.subdomain} class="url-link url-alt" style:color={account.color}>
							{account.subdomain}
						</a>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Subdomain setup -->
	<section class="hint-section">
		<div class="hint-header">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
					x1="12"
					y1="16"
					x2="12.01"
					y2="16"
				/>
			</svg>
			<h2>Subdomain setup (optional)</h2>
		</div>
		<p class="hint-desc">
			The <code>?tenant=</code> query param works out of the box. To use real subdomains locally,
			add these lines to <code>/etc/hosts</code> and restart your browser:
		</p>
		<pre class="code-block">127.0.0.1  acme.localhost
127.0.0.1  globex.localhost
127.0.0.1  initech.localhost</pre>
		<p class="hint-desc">
			Then visit <code>http://acme.localhost:5173</code> directly — no query param needed.
		</p>
	</section>
</div>

<style>
	.page {
		max-width: 880px;
		margin: 0 auto;
		padding: 3rem 1.5rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		/* color: #ff6452; */
	}

	/* Lead hero */
	.lead-hero {
		padding: 1rem 0 0.5rem;
	}

	.lead-hero h1 {
		font-size: clamp(2.5rem, 5vw + 1rem, 5.5rem);
		font-weight: 900;
		letter-spacing: -0.05em;
		line-height: 0.95;
		color: var(--foreground);
		margin-bottom: clamp(0.75rem, 1.5vw, 1.25rem);
	}

	.lead-hero p {
		font-size: clamp(1rem, 1.25vw + 0.5rem, 1.25rem);
		color: var(--muted-foreground);
		line-height: 1.7;
		letter-spacing: -0.01em;
		max-width: 52ch;
	}

	/* Hero */
	.hero {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2rem 2.5rem;
		box-shadow: var(--shadow);
	}

	.hero-brand {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		margin-bottom: 0.75rem;
	}

	.hero-emoji {
		font-size: clamp(1.75rem, 2.5vw + 0.5rem, 2.75rem);
		line-height: 1;
	}

	.hero-brand h1 {
		font-size: clamp(2.25rem, 4vw + 1rem, 4.5rem);
		font-weight: 900;
		letter-spacing: -0.05em;
		line-height: 1;
	}

	.hero-chips {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.chip {
		font-size: clamp(0.75rem, 0.4vw + 0.5rem, 0.875rem);
		color: var(--muted-foreground);
		background: var(--background);
		padding: 0.2rem 0.625rem;
		border-radius: var(--radius-sm);
	}

	.hero-desc {
		font-size: clamp(1rem, 1.25vw + 0.5rem, 1.1875rem);
		color: var(--muted-foreground);
		margin-bottom: 1.5rem;
		max-width: 560px;
		line-height: 1.7;
		letter-spacing: -0.005em;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		padding: 0.5625rem 1.25rem;
		color: white;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: clamp(0.9rem, 0.75vw + 0.5rem, 1.0625rem);
		transition:
			opacity 0.15s,
			box-shadow 0.15s;
		box-shadow: var(--shadow-sm);
	}

	.btn-primary:hover {
		opacity: 0.9;
		box-shadow: var(--shadow);
	}

	/* Card sections */
	.card-section {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.section-header h2 {
		font-size: clamp(0.9375rem, 0.75vw + 0.5rem, 1.125rem);
		font-weight: 600;
		margin-bottom: 0.375rem;
		color: var(--foreground);
	}

	.section-header p {
		font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
		color: var(--muted-foreground);
		line-height: 1.6;
	}

	/* Tenant cards */
	.tenants-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 0.75rem;
	}

	.tenant-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--background);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.875rem 1rem;
		transition:
			box-shadow 0.15s,
			transform 0.15s;
	}

	.tenant-card:hover {
		background: color-mix(in srgb, var(--color) 8%, transparent);
	}

	.t-emoji {
		font-size: clamp(1.25rem, 1.5vw + 0.25rem, 1.625rem);
	}

	.t-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.t-info strong {
		font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
		font-weight: 600;
		color: var(--foreground);
	}

	.t-info span {
		font-size: clamp(0.6875rem, 0.3vw + 0.5rem, 0.8125rem);
		color: var(--muted-foreground);
	}

	.t-info code {
		font-size: clamp(0.625rem, 0.3vw + 0.4rem, 0.75rem);
		color: var(--color);
		background: color-mix(in srgb, var(--color) 8%, transparent);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}

	/* Accounts table */
	.accounts-table {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.table-head {
		display: grid;
		grid-template-columns: 2fr 0.75fr 1.25fr 2.5fr;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: var(--muted);
		color: var(--muted-foreground);
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 0.75fr 1.25fr 2.5fr;
		gap: 0.5rem;
		align-items: center;
		padding: 0.625rem 1rem;
		border-top: 1px solid var(--border);
		font-size: clamp(0.8125rem, 0.5vw + 0.5rem, 0.9375rem);
	}

	.table-row:hover {
		background: var(--muted);
	}

	.email-cell {
		color: var(--foreground);
		font-size: clamp(0.75rem, 0.4vw + 0.45rem, 0.875rem);
	}

	.role-badge {
		display: inline-flex;
		justify-content: center;
		font-size: 0.625rem;
		font-weight: 700;
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		white-space: nowrap;
	}

	.tenant-cell {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: clamp(0.75rem, 0.4vw + 0.45rem, 0.875rem);
		color: var(--foreground);
	}

	.url-cell {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.url-link {
		font-size: clamp(0.6875rem, 0.3vw + 0.45rem, 0.8125rem);
		font-family: ui-monospace, monospace;
		transition: opacity 0.15s;
	}

	.url-link:hover {
		text-decoration: underline;
	}

	.url-sep {
		font-size: 0.625rem;
		color: var(--muted-foreground);
	}

	.url-alt {
		opacity: 0.65;
	}

	/* Hint section */
	.hint-section {
		background: var(--muted);
		border: 1px solid #b6b6b6;
		border-radius: var(--radius-lg);
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.hint-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #fa1b53;
	}

	.hint-header h2 {
		font-size: clamp(0.875rem, 0.75vw + 0.5rem, 1.0625rem);
		font-weight: 600;
	}

	.hint-desc {
		font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
		color: #2e2e37;
		line-height: 1.6;
	}

	.code-block {
		background: #09090b;
		color: #e4e4e7;
		padding: 0.875rem 1.125rem;
		border-radius: var(--radius);
		font-size: clamp(0.75rem, 0.4vw + 0.5rem, 0.875rem);
		font-family: ui-monospace, monospace;
		line-height: 1.75;
		margin: 0;
		overflow-x: auto;
	}
</style>
