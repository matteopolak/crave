/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,svelte,ts}',
	],
	plugins: [
		require('daisyui'),
		require('@tailwindcss/typography'),
	],
	daisyui: {
		themes: ['light', 'dark'],
	},
}
