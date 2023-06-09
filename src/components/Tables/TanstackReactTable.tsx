import {
	ColumnDef,
	Table,
	TableOptions,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

interface Props<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	options?: Partial<TableOptions<TData>>;
}

interface PaginationPanelProps<TData> {
	table: Table<TData>;
}

export const PaginationPanel = <TData,>({
	table,
}: PaginationPanelProps<TData>) => {
	return (
		<>
			<div className="flex items-center gap-2 my-4 ml-2">
				<button
					className="border rounded p-1"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					{'<<'}
				</button>
				<button
					className="border rounded p-1"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{'<'}
				</button>
				<button
					className="border rounded p-1"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{'>'}
				</button>
				<button
					className="border rounded p-1"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					{'>>'}
				</button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</strong>
				</span>
				<span className="flex items-center gap-1">
					| Go to page:
					<input
						type="number"
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0;
							table.setPageIndex(page);
						}}
						className="border p-1 rounded w-16"
					/>
				</span>
				<select
					className="p-1"
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
			</div>
		</>
	);
};

export const TanstackReactTable = <TData, TValue>({
	data,
	columns,
	options,
}: Props<TData, TValue>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		...options,
	});

	return (
		<table className="min-w-full table-auto text-left text-sm text-gray-900 whitespace-nowrap">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th key={header.id} className="p-2">
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
									  )}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody className="divide-y divide-gray-200 text-left">
				{table.getRowModel().rows.map((row, index) => {
					const classes =
						index % 2 === 0 ? 'p-3.5 pl-2 bg-slate-100' : 'p-3.5 pl-2';
					return (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className={classes}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					);
				})}
			</tbody>

			{Boolean(options?.getPaginationRowModel) && (
				<PaginationPanel table={table} />
			)}
		</table>
	);
};
