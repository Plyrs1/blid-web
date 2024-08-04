<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import pb from '$lib/pocketbase';
	import Icon from '@iconify/svelte';
</script>

<Meta />
<div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
	<h1
		class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl"
	>
		BalapLiar-ID
	</h1>
	<p class="mb-8 text-xl font-normal text-gray-300 lg:text-2xl sm:px-16 lg:px-48">
		Tambahkan tulisan motivasi yang bagus disini untuk menarik perhatian.
	</p>
	<div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
		{#if pb.authStore.isValid}
			<a
				href="/leaderboard/submit"
				class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
			>
				Submit Score
			</a>
		{:else}
			<a
				href="/login"
				class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
			>
				Masuk dengan Discord
				<Icon icon="ri:discord-fill" inline={true} style="margin-left: 1rem;" width="2rem" />
			</a>
		{/if}
		<a
			href="/"
			class="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
		>
			Main Sekarang
		</a>
	</div>
</div>
