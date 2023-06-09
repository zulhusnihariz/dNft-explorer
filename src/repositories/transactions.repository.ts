import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RQ_KEY } from '.';
import { getTransaction, getTransactions } from '../services';
import { Transactions } from '../types';

const getTxs = async () => {
	try {
		const { result } = await getTransactions({
			query: [],
			ordering: [],
			from: 0,
			to: 0,
		});
		return result?.transactions as Transactions[];
	} catch (e) {
		return [];
	}
};

const useGetTransactions = () => {
	return useQuery({
		queryKey: [RQ_KEY.GET_TRANSACTIONS],
		queryFn: () => getTxs(),
	});
};

const getTx = async (hash: string) => {
	try {
		const { result } = await getTransaction(hash);
		return result.transaction;
	} catch (e) {
		return [];
	}
};

const useGetTransaction = (hash: string) => {
	return useQuery({
		queryKey: [RQ_KEY.GET_TRANSACTION, hash],
		queryFn: () => getTx(hash),
		enabled: Boolean(hash),
	});
};

export const TransactionsRepository = {
	useGetTransactions,
	useGetTransaction,
};
