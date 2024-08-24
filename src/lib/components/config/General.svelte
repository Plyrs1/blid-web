<script lang="ts">
	import { parseConfig } from '$lib/helper/misc';
	import pb from '$lib/pocketbase';
	import { toast } from '$lib/stores/page';
	import Icon from '@iconify/svelte';
	import { Alert, Button, Input, Spinner, Textarea, Toggle, Tooltip } from 'flowbite-svelte';

	const getConfig = async () => {
		const configs = await pb.collection('config').getFullList();
		return parseConfig(configs);
	};

	const onHomepageFormSubmit = async (e: SubmitEvent) => {
		try {
			const configValues = new FormData(e.target as HTMLFormElement);
			await pb
				.collection('config')
				.create({ name: 'homepage', value: Object.fromEntries(configValues) });
			$toast = {
				type: 'success',
				message: 'Homepage settings saved successfully',
				duration: 2000
			};
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Can't save homepage settings",
				duration: 2000
			};
		}
	};

	const onMiscFormSubmit = async (e: SubmitEvent) => {
		try {
			const checkboxes = (e.target as HTMLFormElement).querySelectorAll('input[type=checkbox]');
			const configValues = new FormData(e.target as HTMLFormElement);
			checkboxes.forEach((cb) => {
				const checkbox = cb as HTMLInputElement;
				const checkboxName = checkbox.getAttribute('name');
				if (!checkboxName) return;
				configValues.set(checkboxName, `${checkbox.checked}`);
			});
			console.log({ configValues });
			await pb
				.collection('config')
				.create({ name: 'misc', value: Object.fromEntries(configValues) });
			$toast = {
				type: 'success',
				message: 'Misc settings saved successfully',
				duration: 2000
			};
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Can't save Misc settings",
				duration: 2000
			};
		}
	};
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-3 text-white">
	{#await getConfig()}
		<div class="col-span-full h-64 flex items-center justify-center">
			<Spinner />
		</div>
	{:then configs}
		{@const homepageConfig = configs.get('homepage')}
		{@const miscConfig = configs.get('misc')}
		<form
			class="col-span-full lg:col-span-2 text-white text-left max-w-lg"
			on:submit|preventDefault={onHomepageFormSubmit}
		>
			<h2 class="text-lg mb-6">Homepage</h2>
			<div class="mb-6">
				<label for="description">Description</label>
				<Textarea
					id="description"
					name="description"
					placeholder="Website description"
					rows="4"
					required
					value={homepageConfig?.get('description')}
				/>
			</div>
			<div class="mb-6">
				<label for="second-button-title">Second Button</label>
				<Input
					type="text"
					id="second-button-title"
					name="buttonTitle"
					placeholder="Button title"
					required
					value={homepageConfig?.get('buttonTitle')}
				/>
				<Input
					type="text"
					id="second-button-url"
					name="buttonUrl"
					placeholder="Button link"
					required
					value={homepageConfig?.get('buttonUrl')}
				/>
			</div>
			<Button type="submit">Save</Button>
		</form>
		<form class="col-span-1" on:submit|preventDefault={onMiscFormSubmit}>
			<h2 class="text-lg mb-6">Misc</h2>
			<Alert color="blue" class="mb-6">
				<Icon icon="ri:information-2-fill" class="w-5 h-5" slot="icon" />
				<span class="font-bold">Note</span> This section is not implemented yet
			</Alert>
			<div class="mb-6">
				<Toggle
					name="maintenanceMode"
					class="text-white w-min whitespace-nowrap"
					checked={miscConfig?.get('maintenanceMode') === 'true'}>Maintenance mode</Toggle
				>
				<Tooltip placement="top">
					Disable all functionality of the website and show user with maintenance message
				</Tooltip>
			</div>
			<div class="mb-6">
				<Toggle
					name="disableSubmission"
					class="text-white w-min whitespace-nowrap"
					checked={miscConfig?.get('disableSubmission') === 'true'}>Disable submission</Toggle
				>
				<Tooltip placement="top">Disable all score submission</Tooltip>
			</div>
			<div class="mb-6">
				<Toggle
					name="disableRegistration"
					class="text-white w-min whitespace-nowrap"
					checked={miscConfig?.get('disableRegistration') === 'true'}>Disable registration</Toggle
				>
				<Tooltip placement="top"
					>Disable new user registration. Registered user will still be able to login as usual</Tooltip
				>
			</div>

			<Button type="submit">Save</Button>
		</form>
	{/await}
</div>
