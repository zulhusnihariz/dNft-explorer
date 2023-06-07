import { create } from 'zustand';
import { HashSlice, createHashSlice } from './slices/search.slice';
import { MetadatasSlice, createMetadataSlice } from './slices/metadata.slice';

type BoundStoreType = HashSlice & MetadatasSlice;

export const useBoundStore = create<BoundStoreType>()((...a) => ({
	...createHashSlice(...a),
	...createMetadataSlice(...a),
}));
