<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Tenant } from '$lib/types/context';

	interface Props {
		data: { tenant: Tenant | null; returnUrl: string | null };
		form?: { error?: string; email?: string };
	}

	let { data, form }: Props = $props();
	let isSubmitting = $state(false);

	const primaryColor = $derived(data.tenant?.branding.primaryColor ?? '#6366f1');
</script>

<svelte:head>
	<title>Sign In — {data.tenant?.name ?? 'SaaS Demo'}</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<div class="card-header">
			<div class="brand">
				<span class="logo-emoji">{data.tenant?.branding.logoEmoji ?? '⬡'}</span>
				<span class="brand-name">{data.tenant?.name ?? 'SaaS Demo'}</span>
			</div>
			<h1>Sign in to your account</h1>
			<p class="subtitle">Enter your email and password below</p>
		</div>

		{#if form?.error}
			<div class="error-alert" role="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
						x1="12"
						y1="16"
						x2="12.01"
						y2="16"
					/></svg
				>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<input type="hidden" name="returnUrl" value={data.returnUrl ?? ''} />

			<div class="field">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={form?.email ?? ''}
					placeholder="you@company.com"
					autocomplete="email"
					required
					disabled={isSubmitting}
				/>
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="••••••••"
					autocomplete="current-password"
					required
					disabled={isSubmitting}
				/>
			</div>

			<button
				type="submit"
				class="submit-btn"
				style:background={primaryColor}
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="spin"
						><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg
					>
					Signing in…
				{:else}
					Sign in
				{/if}
			</button>
		</form>

		<div class="demo-hint">
			<p class="hint-label">Demo accounts — password: <code>password123</code></p>
			<div class="hint-accounts">
				<div class="hint-row">
					<code>alice@acme.com</code>
					<span class="hint-badge admin">admin</span>
					<span class="hint-tenant">🚀 acme.localhost</span>
				</div>
				<div class="hint-row">
					<code>bob@acme.com</code>
					<span class="hint-badge member">member</span>
					<span class="hint-tenant">🚀 acme.localhost</span>
				</div>
				<div class="hint-row">
					<code>carol@globex.com</code>
					<span class="hint-badge owner">owner</span>
					<span class="hint-tenant">⚡ globex.localhost</span>
				</div>
				<div class="hint-row">
					<code>dave@initech.com</code>
					<span class="hint-badge member">member</span>
					<span class="hint-tenant">🏢 initech.localhost</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: var(--muted);
		padding: 2rem;
	}

	.login-card {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2rem;
		width: 100%;
		max-width: 400px;
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.card-header {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.logo-emoji {
		font-size: 1.5rem;
		line-height: 1;
	}

	.brand-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--foreground);
		letter-spacing: -0.01em;
	}

	.card-header h1 {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--foreground);
		letter-spacing: -0.03em;
	}

	.subtitle {
		font-size: 0.875rem;
		color: var(--muted-foreground);
	}

	.error-alert {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		font-size: 0.875rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--foreground);
	}

	input[type='email'],
	input[type='password'] {
		padding: 0.5625rem 0.875rem;
		border: 1px solid var(--input);
		border-radius: var(--radius-sm);
		font-size: 0.9375rem;
		width: 100%;
		background: var(--background);
		color: var(--foreground);
		font-family: inherit;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	input:focus {
		outline: none;
		border-color: var(--foreground);
		box-shadow: 0 0 0 3px rgb(9 9 11 / 0.08);
	}

	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--muted);
	}

	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem;
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		width: 100%;
		margin-top: 0.25rem;
		font-family: inherit;
		transition: opacity 0.15s;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.spin {
		animation: spin 0.8s linear infinite;
	}

	/* Demo hint */
	.demo-hint {
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
	}

	.hint-label {
		font-size: 0.8125rem;
		color: var(--muted-foreground);
		margin-bottom: 0.625rem;
	}

	.hint-accounts {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.hint-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		padding: 0.25rem 0;
	}

	.hint-badge {
		font-size: 0.625rem;
		font-weight: 600;
		padding: 0.125rem 0.4rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: white;
	}

	.hint-badge.admin {
		background: #6366f1;
	}
	.hint-badge.owner {
		background: #0ea5e9;
	}
	.hint-badge.member {
		background: #71717a;
	}

	.hint-tenant {
		margin-left: auto;
		color: var(--muted-foreground);
		font-size: 0.6875rem;
	}
</style>
