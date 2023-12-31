// import Sentry from '@sentry/node/cjs';

// import { SENTRY_DSN } from '$env/static/private';

// Sentry.init({
// 	dsn: SENTRY_DSN,
// 	integrations: [
// 		new Sentry.Integrations.Postgres(),
// 	],
// 	tracesSampleRate: 1.0,
// 	profilesSampleRate: 1.0,
// });

type ToSql = { toSQL: () => { sql: string } };

export async function get<T>(input: T & ToSql): Promise<T> {
	// return Sentry.startSpan(
	// 	{
	// 		op: 'db.query',
	// 		name: input.toSQL().sql,
	// 		data: { 'db.system': 'postgresql' },
	// 	},
	// 	async () => input,
	// );

	return input;
}