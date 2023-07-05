import { useEffect, useMemo } from 'react';
import { Metadatas, Metadata, NftAttribute } from '../../types';
import {
	NftAttributeTable,
	PrettyJSON,
	ExternalURL,
	TanstackReactTable,
} from '../../components';
import {
	constructDataKey,
	formatTimestamp,
	isUrl,
} from '../../utils/utils.functions';

import { useParams } from 'react-router-dom';
import { ColumnDef, defaultColumnSizing } from '@tanstack/react-table';
import { SearchBar } from '../../components/SearchBar';
import { useBoundStore } from '../../store';
import { useRepositories } from '../../repositories';

const MetadataContent = ({ data }: { data: Metadatas }) => {
	const { content } = data.metadata.metadata;
	return (
		<span className="text-xs text-gray-600">
			{JSON.stringify(content)}
		</span>
	);
};

export const MainExplorer = () => {
	const { hash, setHash, history, setHistory } = useBoundStore(
		(state) => state
	);

	const { useGetMetadatasWithHistory } = useRepositories();
	const { data: metadata, refetch } = useGetMetadatasWithHistory();

	const onClickCid = async (d: Metadatas) => {
		const { alias, metadata } = d;
		const { history } = metadata;
		setHistory(alias, history);
	};

	const { address, tokenId, chainId } = useParams();

	useEffect(() => {
		const paramsExists = address && tokenId && chainId;

		if (paramsExists) {
			const args = { address, tokenId, chainId };

			const dataKey = constructDataKey({
				...args,
				nonce: String(process.env.REACT_APP_NONCE),
			});

			let hash = { ...args, dataKey };

			setHash(hash);
			refetch();
		}
	}, []);

	const metadataColumns = useMemo<ColumnDef<Metadatas>[]>(
		() => [
			{
				accessorKey: 'public_key',
				header: () => <span>Public Key</span>,
				cell: ({ row }) => <span className="text-xs">{row.getValue('public_key')}</span>,
				size: 100
			},
			{
				accessorKey: 'alias',
				header: () => <span>Alias</span>,
				cell: ({ row }) => {
					return (
						<span
								className="bg-amber-100 text-indigo-700 text-black text-xs px-2 py-1 rounded w-20 overflow-hidden text-ellipsis"
								>{row.getValue('alias')}</span>
					)
				},
				size: 60,
			},
			{
				accessorKey: 'content',
				header: () => <span>Content</span>,
				cell: ({ row }) => {
					return (
						<>
							<div className="mb-2">
							<span
								className="cursor-pointer bg-indigo-100 text-indigo-700 text-black text-xs font-medium px-2 py-1 rounded w-20 overflow-hidden text-ellipsis"
								onClick={() => {
									onClickCid(row.original);
								}}
							>{row.original.cid}</span>
							</div>
							<MetadataContent data={row.original} />
						</>
					);
				},
			},
		],
		[]
	);

	const historyColumns = useMemo<ColumnDef<Metadata, any>[]>(
		() => [
			{
				accessorKey: 'transaction',
				header: () => <span>Tx</span>,
				cell: ({ row }) => <PrettyJSON data={row.getValue('transaction')} />,
			},
			{
				accessorKey: 'content',
				header: () => <span>Content</span>,
				cell: ({ row }) => {
					const content = row.getValue('content') as any;

					return (
						<span>
							{isUrl(content) ? (
								<ExternalURL url={content} />
							) : typeof content === 'string' ? (
								content
							) : (
								<PrettyJSON data={content} />
							)}
						</span>
					);
				},
			},
			{
				accessorKey: 'previous',
				header: () => <span>Previous</span>,
				cell: ({ row }) => <PrettyJSON data={row.getValue('previous')} />,
			},
			{
				accessorKey: 'timestamp',
				header: () => <span>Date/Time</span>,
				cell: ({ row }) => (
					<span>{formatTimestamp(row.getValue('timestamp'))}</span>
				),
			},
		],
		[]
	);

	return (
		<>
			<div className="w-full flex justify-center bg-[#34568B]">
				<SearchBar />
			</div>

			{metadata && (
				<>
					<section className="flex items-center justify-center pb-5 mx-5 md:mx-0">
						<div className="w-full relative block p-2 shadow-sm text-left">
							<div className="text-gray-600 py-5">
								<span className="text-xl font-bold mr-2">NFT Key</span><span className="text-sm">{hash.dataKey}</span>
							</div>
							<div className="rounded-xl border border-gray-200 bg-white shadow-md">
								<div className="text-sm text-gray-800 p-4 text-left">
									Total {metadata?.length ?? 0} datasets
								</div>

								<div className="overflow-x overflow-x-scroll">
									<TanstackReactTable
										data={metadata ?? []}
										columns={metadataColumns}
									/>
								</div>
							</div>
						</div>
					</section>

					{history.data.length > 0 && (
						<>
							<section className="flex items-center justify-center pb-5 mx-5 md:mx-0">
								<div className="w-full relative block p-2 shadow-sm text-left">
									<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
										<div className="text-sm text-gray-600">
											<p>
												History for alias: <b>{history.alias}</b>
											</p>
										</div>
										<div className="text-sm text-gray-600">
											Total {history.data.length} history
										</div>
									</div>
									<div className="overflow-x overflow-x-scroll">
										<TanstackReactTable data={history.data} columns={historyColumns} />
									</div>
								</div>
							</section>
						</>
					)}
				</>
			)}
		</>
	);
};
