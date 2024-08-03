<script lang="ts">
	const formatDate = (date: Date) => {
		const day = date.toLocaleDateString(window.navigator.language, { weekday: 'long' });
		const localDate = date.toLocaleDateString(window.navigator.language, {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
		const localTime = date.toLocaleTimeString(window.navigator.language, {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `${day}, ${localDate} - ${localTime}`;
	};
	export let title = '-';
	export let content = '-';
	export let date: Date = new Date();
</script>

<!-- <div style="width: 100%; height: 100%; background: rgba(0, 0, 0, 0.20); border-radius: 12px; overflow: hidden; backdrop-filter: blur(20px); flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex"> -->
<div
	class="flex flex-col gap-2 backdrop-blur-md bg-black/20 rounded-lg overflow-hidden border-2 border-white"
>
	<!-- <div style="width: 578px; height: 279px; justify-content: center; align-items: center; display: inline-flex"> -->
	<div class="h-32 overflow-clip">
		<img
			alt="content"
			class="h-full w-full object-cover object-center"
			src="/assets/img/article1.jpg"
		/>
	</div>
	<!-- <div style="align-self: stretch; flex: 1 1 0; padding-left: 22px; padding-right: 22px; padding-top: 12px; padding-bottom: 12px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex"> -->
	<div class="flex flex-col p-4 gap-2 items-start text-left">
		<div class="text-white text-4xl">{title}</div>
		<div class="text-white text-lg">{formatDate(date)}</div>
		<div class="text-white text-lg line-clamp-6">{content}</div>
		<div class="text-white text-lg text-right w-full">
			<a href="/">Read More &gt;</a>
		</div>
	</div>
</div>
