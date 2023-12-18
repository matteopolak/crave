import type { ParamMatcher } from '@sveltejs/kit';

export const match = (p => /^\d+$/.test(p)) satisfies ParamMatcher;
