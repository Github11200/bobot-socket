<script lang="ts">
	import type { Component } from 'svelte';
	import Odometry from '../../components/odometry.svelte';
	import Pid from '../../components/pid.svelte';

	interface Tab {
		name: string;
		component: Component;
	}

	let activeTab: string = $state('PID');
	let tabs: Tab[] = $state([
		{
			name: 'Odometry',
			component: Odometry
		},
		{
			name: 'PID',
			component: Pid
		}
	]);
</script>

<div role="tablist" class="tabs justify-center tabs-box">
	{#each tabs as tab, index (index)}
		{#if activeTab === tab.name}
			<p class="tab-active tab">{tab.name}</p>
		{:else}
			<button
				onclick={() => {
					activeTab = tab.name;
				}}
			>
				<p class="tab">
					{tab.name}
				</p></button
			>
		{/if}
	{/each}
</div>

{#each tabs as tab, index (index)}
	{#if tab.name === activeTab}
		<tab.component />
	{/if}
{/each}
