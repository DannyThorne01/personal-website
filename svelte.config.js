import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html' // Required for SPA
		}),
		paths: {
			base: '/personal-website' // Ensure this matches your GitHub Pages deployment
		},
		prerender: {
			handleHttpError: 'warn', // Prevents 404 errors from failing build
			handleMissingId: 'warn' // Suppresses missing ID errors
		}
	},
	preprocess: [vitePreprocess({})],
};

export default config;
