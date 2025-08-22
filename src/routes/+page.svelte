<script lang="ts">
	import '../app.css';
	import field from '$lib/assets/field.png';
	import Anotherthing from './anotherthing.svelte';

	let portNumber = $state(8000);
	let deviceId = $state(512);
	let socket: null | WebSocket = null;

	const connectWebsocket = () => {
		socket = new WebSocket(
			`ws://localhost:${portNumber}/vexrobotics.vexcode/device?id=${deviceId}`
		);

		socket.addEventListener('open', (e) => {
			console.log('Connected the socket!');
		});
	};
</script>

{#if socket === null}
	<div class="flex flex-col gap-2">
		<Anotherthing />
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
{:else}
	<Anotherthing />
{/if}
