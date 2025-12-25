<script lang="ts">
	import { webSocket } from '$lib/state.svelte';
	import { blobToMessagesParams } from '$lib/utils';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import annotationPlugin from 'chartjs-plugin-annotation';

	let turnErrorChart: Chart | null = $state(null);
	let driveErrorChart: Chart | null = $state(null);
	Chart.register(annotationPlugin);

	interface DataPoint {
		time: number;
		error: number;
	}

	let driveData: DataPoint[] = [];
	let turnData: DataPoint[] = [];

	onMount(() => {
		driveErrorChart = new Chart('driveError', {
			type: 'line',
			data: {
				labels: driveData.map((row) => row.time),
				datasets: [
					{
						label: 'Drive error over time',
						data: driveData.map((row) => row.error),
						tension: 0.2
					}
				]
			},
			options: {
				plugins: {
					annotation: {
						annotations: {
							line1: {
								type: 'line',
								yMin: 10,
								yMax: 10,
								borderColor: 'rgb(255, 99, 132)',
								borderWidth: 2
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							// X-axis title configuration
							display: true,
							text: 'Time (milleseconds)'
						}
					},
					y: {
						title: {
							// Y-axis title configuration
							display: true,
							text: 'Current Y Position (inches)'
						},
						beginAtZero: true
					}
				},
				elements: {
					point: {
						radius: 0
					}
				}
			}
		});
		turnErrorChart = new Chart('turnError', {
			type: 'line',
			data: {
				labels: turnData.map((row) => row.time),
				datasets: [
					{
						label: 'Turn error over time',
						data: turnData.map((row) => row.error),
						tension: 0.2
					}
				]
			},
			options: {
				plugins: {
					annotation: {
						annotations: {
							line1: {
								type: 'line',
								yMin: 0,
								yMax: 0,
								borderColor: 'rgb(255, 99, 132)',
								borderWidth: 2
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							// X-axis title configuration
							display: true,
							text: 'Time (milleseconds)'
						}
					},
					y: {
						title: {
							// Y-axis title configuration
							display: true,
							text: 'Current heading (degrees)'
						},
						beginAtZero: true
					}
				},
				elements: {
					point: {
						radius: 0
					}
				}
			}
		});
	});

	const readBlob = (messageBlob: string) => {
		const messagesParams = blobToMessagesParams(messageBlob);
		for (const messageParams of messagesParams) {
			const messageType = messageParams[0].trim();
			if (messageType !== 'motionData') {
				if (messageType === 'motionEnd') turnData = [];
				continue;
			}

			const motionType = messageParams[1];
			const elapsedTime = messageParams[2];
			const turnError = messageParams[3];
			turnData.push({ time: Number(elapsedTime), error: Number(turnError) });

			if (turnErrorChart === null) continue;

			turnErrorChart.data.labels = turnData.map((row) => row.time);
			turnErrorChart.data.datasets[0].data = turnData.map((row) => row.error);

			turnErrorChart.update('none');

			// If the motion is turning to point or turning to angle then it doesn't have a drive error
			if (motionType !== 'driveToPoint') continue;

			const driveError = messageParams[4];
			driveData.push({ time: Number(elapsedTime), error: Number(driveError) });

			if (driveErrorChart === null) continue;

			driveErrorChart.data.labels = driveData.map((row) => row.time);
			driveErrorChart.data.datasets[0].data = driveData.map((row) => row.error);

			driveErrorChart.update('none');
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

	console.log(turnData.map((item) => item.time));
</script>

<div class="mt-4 flex w-full flex-col items-center justify-center gap-8 px-20">
	<button
		class="btn"
		onclick={() => {
			turnData = [];
			driveData = [];
			if (turnErrorChart !== null) {
				turnErrorChart.data.labels = [];
				turnErrorChart.data.datasets[0].data = [];
				turnErrorChart.update('none');
			}
			if (driveErrorChart !== null) {
				driveErrorChart.data.labels = [];
				driveErrorChart.data.datasets[0].data = [];
				driveErrorChart.update('none');
			}
		}}>Clear</button
	>
	<canvas id="driveError"></canvas>
	<canvas id="turnError"></canvas>
</div>
