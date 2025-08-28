<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	const data = [
		{ year: 2010, count: 10 },
		{ year: 2011, count: 20 },
		{ year: 2012, count: 15 },
		{ year: 2013, count: 25 },
		{ year: 2014, count: 22 },
		{ year: 2015, count: 30 },
		{ year: 2016, count: 28 }
	];

	onMount(() => {
		// @ts-ignore
		new Chart(document.getElementById('acquisitions'), {
			type: 'bar',
			data: {
				labels: data.map((row) => row.year),
				datasets: [
					{
						label: 'Acquisitions by year',
						data: data.map((row) => row.count)
					}
				]
			}
		});
	});
</script>

<div class="flex h-screen w-full items-center justify-center px-20">
	<canvas id="acquisitions"></canvas>
</div>
