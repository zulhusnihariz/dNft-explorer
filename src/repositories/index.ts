import { MetadataRepository } from './metadatas.repository';

export enum RQ_KEY {
	METADATAS = 'metadatas',
}

export const useRepositories = () => ({
	...MetadataRepository,
});
