<script lang="ts">
	import { onMount } from 'svelte';

	import { Blob } from './blob';

	export let width: number;
	export let height: number;
	export let colour: string;

	let canvas: HTMLCanvasElement;

	$: blob = new Blob(width, colour);

	function loop(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		blob.update(ctx);

		window.requestAnimationFrame(() => loop(ctx));
	}

	onMount(() => {
		const ctx = canvas.getContext('2d')!;

		loop(ctx);
	});
</script>

<canvas bind:this={canvas} {width} {height} />
