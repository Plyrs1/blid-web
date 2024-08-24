<script lang="ts">
	import { toast, type ToastData } from '$lib/stores/page';
	import Icon from '@iconify/svelte';
	import { Toast } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	const iconSelector = (name: ToastData['type']) => {
		switch (name) {
			case 'info':
				return 'ri:information-2-line';
			case 'danger':
				return 'ri:close-circle-line';
			case 'warn':
				return 'ri:alert-line';
			case 'success':
				return 'ri:checkbox-circle-line';
			default:
				return '';
		}
	};
	const colorSelector = (name: ToastData['type']) => {
		switch (name) {
			case 'info':
				return 'blue';
			case 'danger':
				return 'red';
			case 'warn':
				return 'yellow';
			case 'success':
				return 'green';
			default:
				return 'primary';
		}
	};

	const toastSubscriber = toast.subscribe(() => {
		setTimeout(() => {
			toast.set(null);
		}, $toast?.duration ?? 5000);
	});

	onDestroy(toastSubscriber);
</script>

{#if !!$toast}
	<div class="fixed top-0 right-0 m-12" transition:fade>
		<Toast
			dismissable={false}
			contentClass="flex space-x-4 divide-x divide-gray-200"
			color={colorSelector($toast.type)}
		>
			<Icon slot="icon" class="h-full w-auto text-3xl" icon={iconSelector($toast.type)} />
			<div class="ps-4 text-sm font-normal self-center">{$toast.message}</div>
		</Toast>
	</div>
{/if}
