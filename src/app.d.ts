// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}

	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			name: string;
			username: string;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}

	namespace svelteHTML {
		interface HTMLAttributes {
			'on:enterviewport'?: () => void;
			'on:exitviewport'?: () => void;
		}
	}
}

export { };
