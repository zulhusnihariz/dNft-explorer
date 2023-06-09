import { useQuery } from '@tanstack/react-query';
import { RQ_KEY } from '.';
import { getMetadataWithHistory, getMetadatas } from '../services';
import { Metadatas } from '../types';
import { useBoundStore } from '../store';

const getMetadatasWithHistory = async (dataKey: string) => {
	try {
		const res = await getMetadatas(dataKey);
		let metadatas = res?.result?.metadatas as Metadatas[];

		const promises = metadatas.map(async (metadata: Metadatas) => {
			let response = await getMetadataWithHistory({
				dataKey: metadata.data_key,
				publicKey: metadata.public_key,
				alias: metadata.alias,
			});

			const { result } = response;

			const haveNoAlias = metadata.alias.length <= 0;
			if (haveNoAlias) metadata.alias = `beat_${metadata.cid.slice(-4)}`;

			let updatedMetadata = {
				...metadata,
				metadata: {
					...result,
					metadata: JSON.parse(result.metadata),
					history: result.history.map((el: any) => JSON.parse(el)),
				},
			};

			return updatedMetadata;
		});

		metadatas = await Promise.all(promises);

		return metadatas;
	} catch (e) {
		return [];
	}
};

const useGetMetadatasWithHistory = () => {
	const { dataKey } = useBoundStore((state) => state.hash);

	return useQuery({
		queryKey: [RQ_KEY.GET_METADATAS_WITH_HISTORY, dataKey],
		queryFn: () => getMetadatasWithHistory(dataKey),
		enabled: Boolean(dataKey),
	});
};

export const MetadataRepository = { useGetMetadatasWithHistory };
