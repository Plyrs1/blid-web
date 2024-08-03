<script lang="ts">
	export let imgUrl = '/assets/img/car1.png';
</script>

<div class="bg-cover bg-center" style="background-image: url('{imgUrl}')">
	<div class="flex flex-col">
		<slot />
		<div class="flex justify-end">
			<span
				class="bg-transparent text-md text-white font-medium mr-2 px-2.5 py-0.5 rounded border-2 border-white"
			>
				<slot name="prize"><p>$ 100.000</p></slot>
			</span>
			<span
				class="bg-transparent text-md text-white font-medium mr-2 px-2.5 py-0.5 rounded border-2 border-white"
			>
				<slot name="challenger"><p>99 Challenger</p></slot>
			</span>
		</div>
		<div />
	</div>
</div>
