import { useMemo, useState } from 'react';

import { Badge, TanstackReactTable } from '../../components';
import { capitalizeWords } from '../../utils/utils.functions';
import { ColumnDef, getPaginationRowModel } from '@tanstack/react-table';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRepositories } from '../../repositories';
import { Transactions } from '../../types';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

dayjs.extend(relativeTime);

const StatusTextBadge = (status: number, error_text?: string) => {
	console.log(error_text)
	switch(status) {
		case 0:
			return (
				<span
					className="inline-flex hover:shadow-md cursor-pointer text-xs items-center justify-center border border-gray-300 rounded-md bg-gray-100 p-2 text-gray-700"
				>
					PENDING
				</span>
			)
		case 1:
			return (
				<span
					className="inline-flex hover:shadow-md cursor-pointer text-xs items-center justify-center border border-gray-300 rounded-md bg-emerald-100 p-2 text-emerald-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</span>
			)
		case 2:
			return (
				<a data-tooltip-id="my-tooltip" data-tooltip-content={error_text}>
					<span
						className="inline-flex hover:shadow-md cursor-pointer text-xs items-center justify-center bg-gray-100 border border-gray-300 rounded-md p-2 text-red-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="h-5 w-5"
						>
							<path
								fill-rule="evenodd"
								d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
				</a>
			)
	}
}

const MethodTextBadge = (method: String) => {
	switch(method) {
		case 'metadata':
			return (
				<Badge
					className="bg-amber-100 text-amber-700 text-black text-xs font-medium px-4 py-1 rounded shadow-sm w-20 overflow-hidden text-ellipsis"
					text={`${capitalizeWords(method.toString())}`}
				/>
			)
		case 'cron':
			return (
				<Badge
					className="bg-indigo-100 text-indigo-700 text-black text-xs font-medium px-4 py-1 rounded shadow-sm w-20 overflow-hidden text-ellipsis"
					text={`${capitalizeWords(method.toString())}`}
				/>
			)
		default:
			return (
				<Badge
					className="bg-gray-100 text-gray-700 text-black text-xs font-medium px-4 py-1 rounded shadow-sm w-20 overflow-hidden text-ellipsis"
					text="Invalid"
				/>
			)
	}
}

export const TransactionsExplorer = () => {
	const { useGetTransactions } = useRepositories();
	const { data: txs } = useGetTransactions();

	const transactionsColumns = useMemo<ColumnDef<Transactions>[]>(
		() => [
			{
				accessorKey: 'status',
				header: () => <span></span>,
				cell: ({ row }) => {
					let error_text = ''
					if (txs) {
						error_text = txs[row.index].error_text ?? ''
					}
					return StatusTextBadge(row.getValue('status'), error_text)
				},
				size: 30,
			},
			{
				accessorKey: 'hash',
				header: () => <span>Tx Hash</span>,
				cell: ({ row }) => (
					<Link to={`/tx/${row.getValue('hash')}`}><p className="truncate">{row.getValue('hash')}</p></Link>
				),
				size: 100,
			},
			{
				accessorKey: 'method',
				header: () => <div className="text-center">Method</div>,
				cell: ({ row }) => {
					return (
						<div className="text-center">
							{MethodTextBadge(row.getValue('method'))}
						</div>
					)
				},
				size: 60
			},
			{
				accessorKey: 'data_key',
				header: () => <span>NFT Key</span>,
				cell: ({ row }) => {
					let pk = ''
					if (txs) {
						pk = txs[row.index].public_key ?? ''
					}
					return (
						<>
							<p className="">{row.getValue('data_key')}</p>
							<Badge
								className="bg-indigo-100 text-indigo-700 text-black text-xs font-medium px-4 py-1 rounded w-20 overflow-hidden text-ellipsis"
								text={`${pk}`}
							/>
						</>
					)
				},
				size: 250,
			},
			{
				accessorKey: 'timestamp',
				header: () => <span>Age</span>,
				cell: ({ row }) => <i>{dayjs(row.getValue('timestamp')).fromNow()} </i>,
			}
		],
		[]
	);

	return (
		<>
			<section className="rounded-xl w-full border border-gray-200 bg-white shadow-md flex items-center justify-center mt-5 md:mx-0">
				<div className="w-full  relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="p-2 sm:items-center sm:justify-between text-left ">
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
							options={{
								getPaginationRowModel: getPaginationRowModel() }}
						/>
					</div>
				</div>
			</section>
			<Tooltip id="my-tooltip" />
		</>
	);
};
