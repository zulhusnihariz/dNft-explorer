import { create } from 'zustand';
import { HashSlice, createHashSlice } from './slices/search.slice';
import { HistorySlice, createHistorySlice } from './slices/history.slice';

type BoundStoreType = HashSlice & HistorySlice;

export const useBoundStore = create<BoundStoreType>()((...a) => ({
	...createHashSlice(...a),
	...createHistorySlice(...a),
}));
