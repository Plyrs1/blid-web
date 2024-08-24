import { writable } from 'svelte/store';

export const newSubmissionCount = writable(0);
export const isCurrentUserAdmin = writable(false);
