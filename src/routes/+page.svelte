<script lang="ts">
	import { t } from '$lib/translations';
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse p-8 lg:p-4">
		<img
			src="/logo.svg"
			class="max-w-48 md:max-w-sm drop-shadow-xl w-full object-cover"
			alt="Crave hero"
		/>

		<div>
			<h1
				class="text-8xl font-extrabold dark:text-neutral-100 text-neutral-800 crave"
			>
				{@html $t('home.title')}
			</h1>

			<p class="py-6 text-3xl">
				{$t('home.subtitle')}
			</p>

			<a href="/register" class="btn btn-lg btn-primary">
				{$t('home.get-started')}
			</a>
			<a href="/recipes" class="btn btn-lg btn-accent">
				{$t('home.browse-recipes')}
			</a>
		</div>
	</div>
</div>

<style>
	:global(.crave > span) {
		@apply bg-gradient-to-r from-primary via-accent to-secondary inline-block text-transparent bg-clip-text;
	}
</style>
