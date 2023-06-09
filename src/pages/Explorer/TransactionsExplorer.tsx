import { useMemo } from 'react';

import { Badge, TanstackReactTable } from '../../components';
import { capitalizeWords } from '../../utils/utils.functions';
import { ColumnDef, getPaginationRowModel } from '@tanstack/react-table';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRepositories } from '../../repositories';
import { Transactions } from '../../types';
import { Link } from 'react-router-dom';

dayjs.extend(relativeTime);

export const TransactionsExplorer = () => {
	const { useGetTransactions } = useRepositories();
	const { data: txs } = useGetTransactions();

	const transactionsColumns = useMemo<ColumnDef<Transactions>[]>(
		() => [
			{
				accessorKey: 'hash',
				header: () => <span>Tx Hash</span>,
				cell: ({ row }) => (
					<Link to={`/tx/${row.getValue('hash')}`}>{row.getValue('hash')}</Link>
				),
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
			<section className="flex items-center justify-center pb-5 mx-5 md:mx-0">
				<div className="w-full  relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
						<div className="text-sm text-gray-600">
							<p>All Transactions</p>
						</div>
						<div className="text-sm text-gray-600">
							Total {txs?.length ?? 0} transactions
						</div>
					</div>
					<div className="overflow-x overflow-x-scroll">
						<TanstackReactTable
							data={txs ?? []}
							columns={transactionsColumns}
							options={{ getPaginationRowModel: getPaginationRowModel() }}
						/>
					</div>
				</div>
			</section>
		</>
	);
};
