<script>
	import { RedocStandalone } from 'redoc-svelte';
</script>

<RedocStandalone specUrl="/docs/openapi.json" />

<style>
	:global(body) {
		@apply min-h-screen bg-white;
	}
</style>
