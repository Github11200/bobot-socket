<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { webSocket } from '$lib/state.svelte';

	let portNumber = $state(7071);
	let deviceId = $state(24876);

	const connectWebsocket = () => {
		webSocket.socket = new WebSocket(
			`ws://localhost:${portNumber}/vexrobotics.vexcode/device?id=${deviceId}`
		);

		webSocket.socket.addEventListener('open', () => {
			console.log('Connected the socket!');
			goto('/dashboard');
		});
	};
</script>

<div class="flex flex-col gap-2 p-4">
	<label class="input w-full">
		<span class="label">Port:</span>
		<input type="number" placeholder="Port number..." class="input" bind:value={portNumber} />
	</label>
	<label class="input w-full">
		<span class="label">Device ID:</span>
		<input type="number" placeholder="Device id..." class="input" bind:value={deviceId} />
	</label>
	<button class="btn btn-neutral" onclick={connectWebsocket}>Connect</button>
</div>
