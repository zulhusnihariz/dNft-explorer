import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

interface Props<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export const TanstackReactTable = <TData, TValue>({
	data,
	columns,
}: Props<TData, TValue>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
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
		</table>
	);
};
