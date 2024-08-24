import { type Writable, writable } from 'svelte/store';
interface PageData {
	description?: string;
	image?: string;
	title?: string;
	name?: string;
	color?: string;
}

export interface ToastData {
	type: 'info' | 'danger' | 'warn' | 'success';
	message: string;
	duration?: number;
}

const isScrolled: Writable<boolean> = writable(false);
const site: Writable<PageData> = writable({});
const scrollOffset: Writable<number> = writable(0);
const toast: Writable<ToastData | null> = writable(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: Writable<Map<string, Map<string, any>>> = writable(new Map());

export { isScrolled, scrollOffset, site, toast, config };
