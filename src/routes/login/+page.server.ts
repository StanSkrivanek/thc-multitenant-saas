// src/routes/login/+page.server.ts

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session) {
		redirect(303, '/dashboard');
	}
	return {
		tenant: locals.tenant,
		returnUrl: url.searchParams.get('returnUrl')
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const dbUser = db.users.authenticate(email, password);

		if (!dbUser) {
			return fail(401, { error: 'Invalid email or password', email });
		}

		// Ensure user belongs to the current tenant
		if (locals.tenant && dbUser.tenantId !== locals.tenant.id) {
			return fail(401, { error: 'Invalid email or password', email });
		}

		const session = db.sessions.create(dbUser.id, 1);

		cookies.set('session', session.token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		const returnUrl = String(form.get('returnUrl') ?? '/dashboard');
		redirect(303, returnUrl.startsWith('/') ? returnUrl : '/dashboard');
	}
};
