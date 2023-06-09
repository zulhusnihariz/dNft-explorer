import { MetadataRepository } from './metadatas.repository';
import { TransactionsRepository } from './transactions.repository';

export enum RQ_KEY {
	GET_METADATAS_WITH_HISTORY = 'get_metadatas_with_history',
	GET_TRANSACTIONS = 'get_transactions',
}

export const useRepositories = () => ({
	...MetadataRepository,
	...TransactionsRepository,
});
