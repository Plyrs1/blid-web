import type { UsersResponse } from '$lib/pocketbaseType';

export const isAdmin = (profile: UsersResponse<Array<number>>) => {
	const test = (profile?.roles ?? []).indexOf(0) !== -1;
	console.log({ func: 'isAdmin', profile, test });
	return test;
};

export const isModerator = (profile: UsersResponse<Array<number>>) => {
	const test = (profile?.roles ?? []).indexOf(10) !== -1;
	console.log({ func: 'isModerator', profile, test });
	return test;
};
