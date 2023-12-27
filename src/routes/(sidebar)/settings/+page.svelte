<script lang="ts">
	import { TRPCClientError } from '@trpc/client';
	import toast from 'svelte-french-toast';

	import At from '~icons/ic/baseline-alternate-email';
	import Delete from '~icons/ic/baseline-delete';
	import Person from '~icons/ic/baseline-person';
	import { PUBLIC_FALLBACK_AVATAR_URL } from '$env/static/public';
	import { trpc } from '$lib/client';
	import { theme } from '$lib/theme';
	import { language, locales, t } from '$lib/translations';
	import { resize } from '$lib/util';
	
	import type { PageData } from './$types';

	let files: FileList;
	let input: HTMLInputElement;

	$: if (files?.length) {
		const file = files[0];
		const reader = new FileReader();

		reader.onload = () => {
			data.user.thumbnail = reader.result as string;
			data.user = data.user;
		};

		reader.readAsDataURL(file);
	}

	async function submit() {
		if (data.user.thumbnail?.startsWith('data:'))
			data.user.thumbnail = await resize(data.user.thumbnail!, 256);

		toast
			.promise(
				trpc.users.update.mutate({
					username: data.user.username,
					name: data.user.name,
					thumbnail: data.user.thumbnail,
				}),
				{
					loading: 'Updating profile...',
					success: 'Profile updated!',
					error: e => {
						if (e instanceof TRPCClientError) {
							return e.message;
						} else {
							return 'An unknown error occurred.';
						}
					},
				},
				{
					style:
						'background-color: oklch(var(--b2)); color: oklch(var(--bc) / var(--tw-text-opacity));',
				},
			)
			.catch(() => {});
	}

	export let data: PageData;
</script>

<div class="flex flex-col items-center h-full">
	<div class="grid max-w-lg w-full gap-2 h-full prose prose-h2:m-0">
		<form class="form-control gap-4" on:submit|preventDefault={submit}>
			<div class="relative w-40">
				<button on:click={() => input.click()} type="button">
					<input
						type="file"
						class="hidden"
						bind:files
						bind:this={input}
						accept="image/*"
					/>

					<div class="w-full aspect-square bg-base-300 rounded-full relative">
						<img
							src={data.user.thumbnail ?? PUBLIC_FALLBACK_AVATAR_URL}
							class="aspect-square rounded-full w-40 object-cover m-0"
							alt="User avatar"
						/>

						<div
							class="badge badge-lg badge-neutral absolute -right-5 bottom-5"
						>
							{$t('label.edit-avatar')}
						</div>
					</div>
				</button>

				{#if data.user.thumbnail}
					<button
						class="absolute -right-10 top-0"
						type="button"
						on:click={() => {
							data.user.thumbnail = null;
							data.user = data.user;
						}}
					>
						<Delete class="text-error w-8 h-8" />
					</button>
				{/if}
			</div>

			<div>
				<label class="label" for="username">
					<span class="label-text">
						{$t('label.username')}
					</span>
				</label>

				<div class="join join-horizontal w-full">
					<div class="join-item bg-base-300 px-4 flex place-items-center">
						<At />
					</div>

					<input
						type="text"
						name="username"
						id="username"
						class="input input-bordered w-full join-item"
						bind:value={data.user.username}
					/>
				</div>
			</div>

			<div>
				<label class="label" for="name">
					<span class="label-text">
						{$t('label.name')}
					</span>
				</label>

				<div class="join join-horizontal w-full">
					<div class="join-item bg-base-300 px-4 flex place-items-center">
						<Person />
					</div>

					<input
						type="text"
						name="name"
						id="name"
						class="input input-bordered w-full join-item"
						bind:value={data.user.name}
					/>
				</div>
			</div>

			<button class="btn btn-accent w-fit place-self-end">
				{$t('label.update-profile')}
			</button>

			<div class="divider" />

			<label class="cursor-pointer label" id="appearance">
				<span class="label-text">
					{$t('label.appearance')}
				</span>

				<select
					class="select select-bordered w-full max-w-xs"
					bind:value={$theme}
				>
					<option value="system">
						{$t('label.system')}
					</option>

					<option value="light">
						{$t('label.light')}
					</option>
					<option value="dark">
						{$t('label.dark')}
					</option>
				</select>
			</label>

			<label class="cursor-pointer label" id="language">
				<span class="label-text">
					{$t('label.language')}
				</span>

				<select
					class="select select-bordered w-full max-w-xs"
					bind:value={$language.locale}
				>
					<option value="system">
						{$t('label.system')}
					</option>

					{#each $locales as l}
						<option value={l}>{$t(`lang.${l}`)}</option>
					{/each}
				</select>
			</label>
		</form>
	</div>
</div>
