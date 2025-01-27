import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base :"/personal-website/",
	build: {
    outDir: 'dist', // Output folder for build files
  },
	plugins: [sveltekit()]
});
