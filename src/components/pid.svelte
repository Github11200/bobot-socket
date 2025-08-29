<script lang="ts">
	import { webSocket } from '$lib/state.svelte';
	import { blobToMessagesParams } from '$lib/utils';
	import Chart, { type ChartItem } from 'chart.js/auto';
	import { onMount } from 'svelte';

	let driveErrorHidden: boolean = $state(false);

	interface DataPoint {
		time: number;
		error: number;
	}

	const driveData: DataPoint[] = [
		{ time: 0.01, error: 5 },
		{ time: 0.02, error: 4 },
		{ time: 0.03, error: 3 },
		{ time: 0.04, error: 2 },
		{ time: 0.05, error: 1 },
		{ time: 0.06, error: -0.5 },
		{ time: 0.07, error: -2 },
		{ time: 0.08, error: 0 }
	];

	const turnData: DataPoint[] = [
		{ time: 0.01, error: 5 },
		{ time: 0.02, error: 4 },
		{ time: 0.03, error: 3 },
		{ time: 0.04, error: 2 },
		{ time: 0.05, error: 1 },
		{ time: 0.06, error: -0.5 },
		{ time: 0.07, error: -2 },
		{ time: 0.08, error: 0 }
	];

	onMount(() => {
		new Chart(document.getElementById('driveError') as ChartItem, {
			type: 'line',
			data: {
				labels: driveData.map((row) => row.time),
				datasets: [
					{
						label: 'Drive error over time',
						data: driveData.map((row) => row.error),
						tension: 0.2
					},
					{
						label: 'Target',
						data: new Array(driveData.length).fill(0),
						pointRadius: 0
					}
				]
			}
		});
	});

	new Chart('turnError', {
		type: 'line',
		data: {
			labels: turnData.map((row) => row.time),
			datasets: [
				{
					label: 'Turn error over time',
					data: turnData.map((row) => row.error),
					tension: 0.2
				},
				{
					label: 'Target',
					data: new Array(turnData.length).fill(0),
					pointRadius: 0
				}
			]
		}
	});

	const readBlob = (messageBlob: string) => {
		const messagesParams = blobToMessagesParams(messageBlob);
		for (const messageParams of messagesParams) {
			const messageType = messageParams[0];
			if (messageType !== 'motionData') continue;

			const motionType = messageParams[1];
			const elapsedTime = messageParams[2];
			const turnError = messageParams[3];
			turnData.push({ time: Number(elapsedTime), error: Number(turnError) });

			// If the motion is turning to point or turning to angle then it doesn't have a drive error
			if (motionType === 'turnToPoint' || motionType === 'turnToAngle') {
				driveErrorHidden = true;
				continue;
			}

			const driveError = messageParams[4];
			driveData.push({ time: Number(elapsedTime), error: Number(driveError) });
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
</script>

<div class="mt-4 flex h-screen w-full flex-col items-center justify-center gap-8 px-20">
	{#if !driveErrorHidden}
		<canvas id="driveError"></canvas>
	{/if}
	<canvas id="turnError"></canvas>
</div>
