export const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
};

export const formatRaceTime = (ms: number) => {
	return new Date(ms).toISOString().slice(11, -1); // "03:25:45.000"
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseConfig = (configs: any[]) =>
	new Map(
		configs.map((c) => {
			const parseValue = c.value as { [key: string]: string };
			const valueKeys = Object.keys(parseValue);
			return [c.name, new Map(valueKeys.map((vk) => [vk, parseValue[vk] ?? null]))];
		})
	);
