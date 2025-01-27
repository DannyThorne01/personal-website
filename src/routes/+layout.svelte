export const prerender = true;
export const trailingSlash = "always";
<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
