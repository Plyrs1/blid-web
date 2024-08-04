<script lang="ts">
	import pb from '$lib/pocketbase';
	import { toast } from '$lib/stores/page';
	import { onMount } from 'svelte';

	onMount(() => {
		pb.authStore.clear();
		setTimeout(() => {
			window.location.href = '/';
			$toast = { type: 'success', message: 'Logged out successfully' };
		}, 2000);
	});
</script>

<div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56 text-white">
	<p class=" text-3xl">Logging out...</p>
</div>
