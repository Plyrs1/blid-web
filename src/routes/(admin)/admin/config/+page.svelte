<script lang="ts">
	import CarLists from '$lib/components/config/CarLists.svelte';
	import General from '$lib/components/config/General.svelte';
	import { isCurrentUserAdmin } from '$lib/stores/admin';
	import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<Tabs
	tabStyle="underline"
	contentClass="p-4 bg-black/40 text-white rounded-lg rounded-t-none border-white border-2"
	activeClasses="p-4 text-primary-600 bg-white text-black rounded-t-lg"
	inactiveClasses="p-4 text-white rounded-t-lg hover:text-black hover:bg-white"
>
	{#if $isCurrentUserAdmin}
		<TabItem open title="General">
			<General />
		</TabItem>
	{/if}
	<TabItem open={!$isCurrentUserAdmin} title="Cars">
		<CarLists />
	</TabItem>
	<TabItem title="Categories">
		<p class="text-sm text-white">Category Page</p>
	</TabItem>
</Tabs>
