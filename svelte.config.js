import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build', // Ensure it matches the GitHub Actions workflow
			assets: 'build',
			fallback: 'index.html' // Required for SPAs
		}),
		paths: {
			base: '/personal-website', // Set the base path for GitHub Pages
		}
	},
	preprocess: [vitePreprocess({})],
};

export default config;
