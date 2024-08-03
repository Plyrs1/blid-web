import { PUBLIC_PB_URL } from '$env/static/public';
import type { TypedPocketBase } from './pocketbaseType';
import PocketBase from 'pocketbase';
const pb: TypedPocketBase = new PocketBase(PUBLIC_PB_URL);

export default pb;
