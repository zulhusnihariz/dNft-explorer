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
import { ColumnDef } from '@tanstack/react-table';
import { SearchBar } from '../../components/SearchBar';
import { useBoundStore } from '../../store';
import { useRepositories } from '../../repositories';

const MetadataContent = ({ data }: { data: Metadatas }) => {
	const { alias } = data;
	const { content } = data.metadata.metadata;
	const contentString = String(content);
	return (
		<>
			{alias === 'attributes' ? (
				<NftAttributeTable attributes={content as NftAttribute[]} />
			) : isUrl(contentString) ? (
				<ExternalURL url={contentString} />
			) : (
				content
			)}
		</>
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
				cell: ({ row }) => <span>{row.getValue('public_key')}</span>,
			},
			{
				accessorKey: 'alias',
				header: () => <span>Alias</span>,
				cell: ({ row }) => <span>{row.getValue('alias')}</span>,
			},
			{
				accessorKey: 'content',
				header: () => <span>Content</span>,
				cell: ({ row }) => {
					return <MetadataContent data={row.original} />;
				},
			},
			{
				accessorKey: 'cid',
				header: () => <span>CID</span>,
				cell: ({ row }) => {
					return (
						<span
							className="cursor-pointer"
							onClick={() => {
								onClickCid(row.original);
							}}
						>
							{row.getValue('cid')}
						</span>
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
			<SearchBar />

			<section className="flex items-center justify-center p-5 bottom-56">
				<div className="w-full  relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
						<div className="text-sm text-gray-600">
							Metadata for data key: <b>{hash.dataKey}</b>
						</div>
						<div className="text-sm text-gray-600">
							Total {metadata?.length ?? 0} datasets
						</div>
					</div>

					<div className="overflow-x overflow-x-scroll">
						<TanstackReactTable
							data={metadata ?? []}
							columns={metadataColumns}
						/>
					</div>
				</div>
			</section>

			<section className="flex items-center justify-center p-5">
				<div className="w-full  relative block border border-gray-100 p-2 shadow-sm text-left">
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
	);
};
