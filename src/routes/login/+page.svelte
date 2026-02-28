<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Tenant } from '$lib/types/context';

	interface Props {
		data: { tenant: Tenant | null; returnUrl: string | null };
		form?: { error?: string; email?: string };
	}

	let { data, form }: Props = $props();
	let isSubmitting = $state(false);

	//TODO:  data.tenant - This reference only captures the initial value of `data`. Did you mean to reference it inside a closure instead?
	// https://svelte.dev/e/state_referenced_locallysveltestate_referenced_locally
	//let data: {
	//    tenant: Tenant | null;
	//    returnUrl: string | null;
	//}

	const primaryColor = data.tenant?.branding.primaryColor ?? '#6366f1';
</script>

<svelte:head>
	<title>Sign In — {data.tenant?.name ?? 'SaaS Demo'}</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<div class="brand">
			<span class="logo">{data.tenant?.branding.logoEmoji ?? '⬡'}</span>
			<h1>{data.tenant?.name ?? 'SaaS Demo'}</h1>
		</div>

		{#if form?.error}
			<div class="error-alert" role="alert">{form.error}</div>
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

			<button type="submit" style:background={primaryColor} disabled={isSubmitting}>
				{isSubmitting ? 'Signing in…' : 'Sign in'}
			</button>
		</form>

		<div class="demo-hint">
			<p>Demo accounts (password: <code>password123</code>):</p>
			<ul>
				<li><code>alice@acme.com</code> — admin → visit <code>acme.localhost</code></li>
				<li><code>bob@acme.com</code> — member → visit <code>acme.localhost</code></li>
				<li><code>carol@globex.com</code> — owner → visit <code>globex.localhost</code></li>
				<li><code>dave@initech.com</code> — member → visit <code>initech.localhost</code></li>
			</ul>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: #f8fafc;
		padding: 2rem;
	}

	.login-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 2rem;
		width: 100%;
		max-width: 400px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.logo {
		font-size: 2rem;
	}
	.brand h1 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.error-alert {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 1.25rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	input[type='email'],
	input[type='password'] {
		padding: 0.6rem 0.8rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.9rem;
		width: 100%;
		box-sizing: border-box;
	}

	input:focus {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	button[type='submit'] {
		padding: 0.65rem;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		margin-top: 0.5rem;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.demo-hint {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e2e8f0;
		font-size: 0.78rem;
		color: #64748b;
	}

	.demo-hint ul {
		padding-left: 1rem;
		margin: 0.5rem 0 0;
	}
	.demo-hint li {
		margin-bottom: 0.25rem;
	}
	.demo-hint code {
		background: #f1f5f9;
		padding: 0.1rem 0.3rem;
		border-radius: 0.2rem;
	}
</style>
