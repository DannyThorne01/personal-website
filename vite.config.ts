import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	base: '/personal-website/', // Matches GitHub Pages base path
	build: {
		outDir: 'build', // Matches the workflow "path" for artifacts
	},
});