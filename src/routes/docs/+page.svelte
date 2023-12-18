<script>
	import { RedocStandalone } from 'redoc-svelte';
</script>

<RedocStandalone specUrl="https://redocly.github.io/redoc/openapi.yaml" />

<style>
	:global(body) {
		@apply min-h-screen bg-white;
	}
</style>
