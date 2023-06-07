import { useEffect, useMemo } from 'react';
import { getMetadatasWithHistory } from '../../services';
import { Metadatas, HashFormat, Metadata, NftAttribute } from '../../types';
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
	const hash = useBoundStore((state) => state.hash);
	const setHash = useBoundStore((state) => state.setHash);
	const metadatas = useBoundStore((state) => state.metadatas);
	const setMetadatas = useBoundStore((state) => state.setMetadatas);
	const history = useBoundStore((state) => state.history);
	const setHistory = useBoundStore((state) => state.setHistory);

	const includeHashInURL = (hash: HashFormat) => {
		const currentUrl = window.location.href;

		const url = new URL(currentUrl);

		const { address, tokenId, chainId } = hash;
		const newPath = `${address}/${tokenId}/${chainId}`;
		url.pathname = newPath;

		const newUrl = url.href;
		window.history.pushState({ path: newUrl }, '', newUrl);
	};

	const onClickCid = async (d: Metadatas) => {
		const { alias, metadata } = d;
		const { history } = metadata;
		setHistory(alias, history);
	};

	useEffect(() => {
		if (hash.dataKey) includeHashInURL(hash);
	}, [hash.dataKey]);

	const { address, tokenId, chainId } = useParams();

	useEffect(() => {
		const fetch = async () => {
			const paramsExists = address && tokenId && chainId;

			if (paramsExists) {
				const args = { address, tokenId, chainId };

				const dataKey = constructDataKey({
					...args,
					nonce: String(process.env.REACT_APP_NONCE),
				});

				let hash = { ...args, dataKey };

				setHash(hash);

				try {
					let metadatas = await getMetadatasWithHistory(hash.dataKey);
					setMetadatas(metadatas as Metadatas[]);
				} catch (e) {
					setMetadatas([] as Metadatas[]);
				}
			}
		};

		fetch();
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

			<section className="flex w-screen items-center justify-center p-5 pt-48">
				<div className="w-full  relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
						<div className="text-sm text-gray-600">
							Metadata for data key: <b>{hash.dataKey}</b>
						</div>
						<div className="text-sm text-gray-600">
							Total {metadatas.length} datasets
						</div>
					</div>

					<div className="overflow-x overflow-x-scroll">
						<TanstackReactTable data={metadatas} columns={metadataColumns} />
					</div>
				</div>
			</section>

			<section className="flex w-screen items-center justify-center p-5">
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
