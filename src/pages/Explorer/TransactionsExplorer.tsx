import { useEffect, useMemo, useState } from 'react';

import { getSuccessTransactions } from '../../services';
import { Badge, TanstackReactTable } from '../../components';
import { capitalizeWords } from '../../utils/utils.functions';
import { ColumnDef } from '@tanstack/react-table';
import { TransactionsType } from '../../types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SearchBar } from '../../components/SearchBar';

dayjs.extend(relativeTime);

export const TransactionsExplorer = () => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetch = async () => {
			let response = await getSuccessTransactions({ from: 1672581011 });

			setData(response.transactions);
		};

		fetch();
	}, []);

	const transactionsColumns = useMemo<ColumnDef<TransactionsType>[]>(
		() => [
			{
				accessorKey: 'hash',
				header: () => <span>Tx Hash</span>,
				cell: ({ row }) => <i>{row.getValue('hash')}</i>,
			},
			{
				accessorKey: 'method',
				header: () => <span>Method</span>,
				cell: ({ row }) => {
					return (
						<Badge
							className="bg-[#F8F9FA] text-black text-xs font-medium px-4 py-1 rounded shadow-sm w-20 overflow-hidden text-ellipsis"
							text={`${capitalizeWords(row.getValue('method'))}`}
						/>
					);
				},
			},
			{
				accessorKey: 'timestamp',
				header: () => <span>Age</span>,
				cell: ({ row }) => <i>{dayjs(row.getValue('timestamp')).fromNow()} </i>,
			},
			{
				accessorKey: 'public_key',
				header: () => <span>Public Key</span>,
				cell: ({ row }) => <i>{row.getValue('public_key')}</i>,
			},
		],
		[]
	);

	return (
		<>
			<SearchBar />

			<section className="flex w-screen items-center justify-center p-5 pt-48">
				<div className="w-full  relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="overflow-x overflow-x-scroll">
						<TanstackReactTable data={data} columns={transactionsColumns} />
					</div>
				</div>
			</section>
		</>
	);
};
