<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';
	import Channel from './(components)/Channel.svelte';

	$: recipes = createQuery({
		queryKey: ['user_recipes'],
		queryFn: () =>
			trpc.users.recipes.query({
				username: $page.params.user,
			}),
	});

	$: user = createQuery({
		queryKey: ['user_profile'],
		queryFn: () =>
			trpc.users.get.query({
				username: $page.params.user,
			}),
	});
</script>

<div class="grid place-items-center p-8">
	<div class="grid max-w-7xl navbar gap-16">
		<Channel user={$user} />
		<RecipeGrid
			recipes={$recipes}
			author
			load={i =>
				trpc.users.recipes.query({
					username: $page.params.user,
					page: i,
				})}
		/>
	</div>
</div>
