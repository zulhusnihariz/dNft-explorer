import { StateCreator } from 'zustand';

export interface HistorySlice {
	history: { alias: string; data: any[] };
	setHistory: (alias: string, history: any[]) => void;
	resetHistory: () => void;
}

export const createHistorySlice: StateCreator<
	HistorySlice,
	[],
	[],
	HistorySlice
> = (set) => ({
	history: { alias: '', data: [] },
	setHistory: (alias: string, history: any[]) => {
		set({ history: { alias, data: history } });
	},
	resetHistory: () => {
		set({ history: { alias: '', data: [] } });
	},
});
