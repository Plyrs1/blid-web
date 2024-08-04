<script lang="ts">
	import { goto } from '$app/navigation';
	import pb from '$lib/pocketbase';
	import type { UsersResponse } from '$lib/pocketbaseType';
	import { toast } from '$lib/stores/page';
	import type { RecordAuthResponse } from 'pocketbase';
	const authenticateUser = async () => {
		const authData = (await pb.collection('users').authWithOAuth2({
			provider: 'discord'
		})) as RecordAuthResponse<UsersResponse<Array<number>>>;

		if (!authData.token) {
			pb.authStore.clear();
			$toast = { type: 'danger', message: 'Login failed' };
			throw new Error("Can't login");
		}

		$toast = { type: 'success', message: 'Login success!' };
		setTimeout(() => goto('/'), 3000);
		return true;
	};
</script>

<div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56 text-white">
	{#await authenticateUser()}
		<p class=" text-3xl">Logging in...</p>
		<p>Tolong perbolehkan popup agar anda bisa login menggunakan Discord</p>
	{:then}
		<p class=" text-3xl">Login berhasil!</p>
	{/await}
</div>
