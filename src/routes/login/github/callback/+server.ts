import { auth, githubAuth } from '$lib/server/lucia.js';
import { getRedirectWithCookie } from '$lib/server/url.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const { getExistingUser, githubUser, createUser } =
			await githubAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;

			const user = await createUser({
				attributes: {
					name: githubUser.name ?? githubUser.login,
					username: githubUser.login,
				},
			});

			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {},
		});

		locals.auth.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: getRedirectWithCookie('github_oauth_from', cookies),
			},
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			return new Response(null, {
				status: 400,
			});
		}

		return new Response(null, {
			status: 500,
		});
	}
};
