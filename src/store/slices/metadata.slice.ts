import { StateCreator } from 'zustand';
import { Metadatas } from '../../types';

export interface MetadatasSlice {
	metadatas: Metadatas[];
	history: { alias: string; data: any[] };
	setMetadatas: (metadata: Metadatas[]) => void;
	setHistory: (alias: string, history: any[]) => void;
}

export const createMetadataSlice: StateCreator<
	MetadatasSlice,
	[],
	[],
	MetadatasSlice
> = (set) => ({
	metadatas: [],
	history: { alias: '', data: [] },
	setMetadatas: (metadatas: Metadatas[]) => {
		set({ metadatas });
	},
	setHistory: (alias: string, history: any[]) => {
		set({ history: { alias, data: history } });
	},
});
