<script lang="ts">
	import { goto } from '$app/navigation';
	import field from '$lib/assets/field.png';
	import Canvas from '$lib/canvas';
	import { webSocket } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	let messages: string[] = $state([]);
	let canvas = $state<HTMLCanvasElement>();

	onMount(() => {
		if (canvas === undefined) return;

		const context = canvas.getContext('2d');
		if (context === null) return;

		let frame: number | null = null;

		let canvasManagement: Canvas = new Canvas(context);

		(function loop() {
			frame = requestAnimationFrame(loop);
			canvasManagement.drawImage({ src: field });
		})();

		return () => {
			if (frame !== null) cancelAnimationFrame(frame);
		};
	});

	// if (webSocket.socket === null) goto('/');

	// webSocket.socket?.addEventListener('message', (event) => {
	// 	const blobData = event.data;
	// 	console.log(typeof blobData);

	// 	const blobReader = new FileReader();

	// 	blobReader.onload = () => {
	// 		if (typeof blobReader.result === 'string')
	// 			blobReader.result.split('/r').forEach((value) => messages.push(value));
	// 	};

	// 	blobReader.readAsText(blobData);
	// });
</script>

<div class="flex h-screen items-center">
	<div class="mx-auto flex h-[90%] w-[90%] gap-4">
		<canvas id="cool" bind:this={canvas} width={2000} height={2000}></canvas>
		<div class="w-[100%] overflow-y-scroll rounded-xl bg-gray-700 p-4">
			{#if messages.length === 0}
				<p>No messages...</p>
			{:else}
				{#each messages as message}
					<p>""</p>
				{/each}
			{/if}
		</div>
	</div>
</div>
