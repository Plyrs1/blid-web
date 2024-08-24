/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	Config = 'config',
	LbApproveLog = 'lb_approve_log',
	LbCars = 'lb_cars',
	LbCategory = 'lb_category',
	LbRecord = 'lb_record',
	NfscarsFiles = 'nfscars_files',
	Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: T;
};

export type AuthSystemFields<T = never> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type ConfigRecord<Tvalue = unknown> = {
	editedBy?: RecordIdString;
	name?: string;
	value?: null | Tvalue;
};

export type LbApproveLogRecord = {
	author?: RecordIdString;
	entry?: RecordIdString;
	isApproved?: boolean;
};

export type LbCarsRecord = {
	author?: RecordIdString;
	name?: string;
};

export type LbCategoryRecord = {
	category?: string;
	subcategory?: string;
};

export type LbRecordRecord = {
	achieved?: IsoDateString;
	car: RecordIdString;
	category: RecordIdString;
	desc?: string;
	time: number;
	url?: string;
	user: RecordIdString;
};

export type NfscarsFilesRecord = {
	date?: IsoDateString;
	path?: string;
	size?: number;
};

export type UsersRecord<Troles = unknown> = {
	avatarUrl?: string;
	isBanned?: boolean;
	discordId?: string;
	name?: string;
	roles?: null | Troles;
	lastLogin?: IsoDateString;
};

// Response types include system fields and match responses from the PocketBase API
export type ConfigResponse<Tvalue = unknown, Texpand = unknown> = Required<ConfigRecord<Tvalue>> &
	BaseSystemFields<Texpand>;
export type LbApproveLogResponse<Texpand = unknown> = Required<LbApproveLogRecord> &
	BaseSystemFields<Texpand>;
export type LbCarsResponse<Texpand = unknown> = Required<LbCarsRecord> & BaseSystemFields<Texpand>;
export type LbCategoryResponse<Texpand = unknown> = Required<LbCategoryRecord> &
	BaseSystemFields<Texpand>;
export type LbRecordResponse<Texpand = unknown> = Required<LbRecordRecord> &
	BaseSystemFields<Texpand>;
export type NfscarsFilesResponse<Texpand = unknown> = Required<NfscarsFilesRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Troles = unknown, Texpand = unknown> = Required<UsersRecord<Troles>> &
	AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	config: ConfigRecord;
	lb_approve_log: LbApproveLogRecord;
	lb_cars: LbCarsRecord;
	lb_category: LbCategoryRecord;
	lb_record: LbRecordRecord;
	nfscars_files: NfscarsFilesRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	config: ConfigResponse;
	lb_approve_log: LbApproveLogResponse;
	lb_cars: LbCarsResponse;
	lb_category: LbCategoryResponse;
	lb_record: LbRecordResponse;
	nfscars_files: NfscarsFilesResponse;
	users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'config'): RecordService<ConfigResponse>;
	collection(idOrName: 'lb_approve_log'): RecordService<LbApproveLogResponse>;
	collection(idOrName: 'lb_cars'): RecordService<LbCarsResponse>;
	collection(idOrName: 'lb_category'): RecordService<LbCategoryResponse>;
	collection(idOrName: 'lb_record'): RecordService<LbRecordResponse>;
	collection(idOrName: 'nfscars_files'): RecordService<NfscarsFilesResponse>;
	collection(idOrName: 'users'): RecordService<UsersResponse>;
};
