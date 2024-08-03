/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	LbApproveLog = 'lb_approve_log',
	LbCars = 'lb_cars',
	LbCategory = 'lb_category',
	LbRecord = 'lb_record',
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

export type LbApproveLogRecord = {
	approvedBy?: RecordIdString;
	entry?: RecordIdString;
};

export type LbCarsRecord = {
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
	time: number;
	url?: string;
	user: RecordIdString;
};

export type UsersRecord<Troles = unknown> = {
	avatar?: string;
	avatarUrl?: string;
	discordId?: string;
	name?: string;
	roles?: null | Troles;
};

// Response types include system fields and match responses from the PocketBase API
export type LbApproveLogResponse<Texpand = unknown> = Required<LbApproveLogRecord> &
	BaseSystemFields<Texpand>;
export type LbCarsResponse<Texpand = unknown> = Required<LbCarsRecord> & BaseSystemFields<Texpand>;
export type LbCategoryResponse<Texpand = unknown> = Required<LbCategoryRecord> &
	BaseSystemFields<Texpand>;
export type LbRecordResponse<Texpand = unknown> = Required<LbRecordRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Troles = unknown, Texpand = unknown> = Required<UsersRecord<Troles>> &
	AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	lb_approve_log: LbApproveLogRecord;
	lb_cars: LbCarsRecord;
	lb_category: LbCategoryRecord;
	lb_record: LbRecordRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	lb_approve_log: LbApproveLogResponse;
	lb_cars: LbCarsResponse;
	lb_category: LbCategoryResponse;
	lb_record: LbRecordResponse;
	users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'lb_approve_log'): RecordService<LbApproveLogResponse>;
	collection(idOrName: 'lb_cars'): RecordService<LbCarsResponse>;
	collection(idOrName: 'lb_category'): RecordService<LbCategoryResponse>;
	collection(idOrName: 'lb_record'): RecordService<LbRecordResponse>;
	collection(idOrName: 'users'): RecordService<UsersResponse>;
};
