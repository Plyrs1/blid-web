export interface PocketBaseCommonResponse<Item> {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: Item[];
}

export interface PocketBaseCommonRecord {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
}

export interface LeaderboardCategory extends PocketBaseCommonRecord {
	category: string;
	subcategory: string;
}
