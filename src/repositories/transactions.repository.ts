import { useQuery } from '@tanstack/react-query';
import { RQ_KEY } from '.';
import { getTransactions } from '../services';
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

export const TransactionsRepository = { useGetTransactions };
