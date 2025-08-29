<script lang="ts">
	import { goto } from '$app/navigation';
	import field from '$lib/assets/field.png';
	import Canvas from '$lib/canvas';
	import { webSocket } from '$lib/state.svelte';
	import type { MessageType, Pose } from '$lib/types/types';
	import { blobToMessagesParams, degToRad } from '$lib/utils';
	import { onMount } from 'svelte';

	// Dip if the web socket didn't cook
	if (webSocket.socket === null) goto('/');

	let currentPosition: Pose = $state({ x: 0, y: 0, orientation: 0 });
	let robotWidth = $state(14);
	let messages: string[] = $state([]);

	let canvas = $state<HTMLCanvasElement>();
	let context: CanvasRenderingContext2D | null = null;
	let canvasManagement: Canvas | null = null;

	let paused: boolean = $state(false);

	const readBlob = (messageBlob: string) => {
		const messagesParams = blobToMessagesParams(messageBlob);
		for (const messageParam of messagesParams) {
			const messageType: MessageType = messageParam[0] as MessageType;

			switch (messageType) {
				case 'position':
					currentPosition = {
						x: Number(messageParam[1]),
						y: Number(messageParam[2]),
						orientation: Number(messageParam[3])
					};
					break;
				case 'message':
					messages.push(messageParam[1]);
					break;
				default:
					break;
			}
		}
	};

	webSocket.socket?.addEventListener('message', (event) => {
		const blobData = event.data;
		const blobReader = new FileReader();

		blobReader.onload = () => {
			if (typeof blobReader.result === 'string') readBlob(blobReader.result);
		};

		blobReader.readAsText(blobData);
	});

	const loop = () => {
		if (paused || canvasManagement === null) {
			return;
		}

		canvasManagement.drawImage({ src: field });

		canvasManagement.drawCircle({
			x: canvasManagement.inchesToPixels(currentPosition.x),
			y: canvasManagement.inchesToPixels(currentPosition.y),
			width: canvasManagement.inchesToPixels(robotWidth) / 2,
			height: canvasManagement.inchesToPixels(robotWidth) / 2
		});

		canvasManagement.drawLine({
			x: canvasManagement.inchesToPixels(currentPosition.x),
			y: canvasManagement.inchesToPixels(currentPosition.y),
			height: 150 * Math.sin(degToRad(currentPosition.orientation)),
			width: 150 * Math.cos(degToRad(currentPosition.orientation)),
			strokeColor: 'green',
			strokeWidth: 10
		});

		requestAnimationFrame(loop);
	};

	const startAnimation = () => {
		requestAnimationFrame(loop);
	};

	onMount(() => {
		if (canvas === undefined) return;

		context = canvas.getContext('2d');
		if (context === null) return;
		canvasManagement = new Canvas(context);

		startAnimation();
	});
</script>

<div class="mb-10 flex flex-col">
	<div class="mt-4 flex h-screen flex-col items-center gap-4">
		<div class="flex gap-2">
			<label class="input w-full">
				<span class="label">Robot width:</span>
				<input class="input" bind:value={robotWidth} />
			</label>
			<button
				class="btn mx-auto mb-2 btn-info"
				onclick={() => {
					if (!paused) paused = true;
					else {
						paused = false;
						startAnimation();
					}
				}}
			>
				{#if paused}
					Unpause
				{:else}
					Pause
				{/if}
			</button>
		</div>
		<div class="mx-auto prose flex gap-4 text-2xl">
			<span>X: {currentPosition.x}</span>
			<span>Y: {currentPosition.y}</span>
			<span>Theta: {currentPosition.orientation}</span>
		</div>
		<div class="mx-auto flex h-[90%] w-[90%] justify-center gap-4">
			<canvas id="cool" bind:this={canvas} width={2000} height={2000} class="border-2"></canvas>
			<div class="h-full w-[40%] rounded-xl bg-base-300 p-4">
				<h1 class="prose prose-2xl">Logs</h1>
				{#if messages.length === 0}
					<p class="prose">No messages...</p>
				{:else}
					{#each messages as message, index (index)}
						<p class="prose mb-2">{message}</p>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
