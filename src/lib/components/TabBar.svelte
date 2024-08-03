<script lang="ts">
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	// export let activeTab: Writable<string> = writable("")
	export let activeTab: string;
	export let activeClass: Writable<string> = writable('');

	setContext('activeTab', activeTab);
	setContext('activeClass', $activeClass);
</script>

<div class="flex flex-col md:flex-row gap-2 container py-2 justify-between parent">
	<slot name="left" />
	<slot name="right" />
</div>

<style>
	.parent :global(div) {
		@apply flex gap-2;
	}
</style>
