import type { UsersResponse } from '$lib/pocketbaseType';

export const isAdmin = (profile: UsersResponse<Array<string>>) => {
	const test = (profile?.roles ?? []).indexOf('admin') !== -1;
	return test;
};

export const isModerator = (profile: UsersResponse<Array<string>>) => {
	const test = (profile?.roles ?? []).indexOf('mod') !== -1;
	return test;
};
