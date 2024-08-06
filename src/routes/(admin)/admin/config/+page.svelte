<script lang="ts">
	import CarLists from '$lib/components/config/CarLists.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<Tabs
	tabStyle="underline"
	contentClass="p-4 bg-black/40 text-white rounded-lg mt-4"
	activeClasses="p-4 text-primary-600 bg-white text-black rounded-t-lg"
	inactiveClasses="p-4 text-white rounded-t-lg hover:text-black hover:bg-white"
>
	<TabItem open title="Cars">
		<CarLists />
	</TabItem>
	<TabItem title="Categories">
		<p class="text-sm text-white">Category Page</p>
	</TabItem>
</Tabs>
