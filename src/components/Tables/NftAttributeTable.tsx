import { NftAttribute } from '../../types';
export const NftAttributeTable = (props: { attributes: NftAttribute[] }) => {
	return (
		<table className="divide-y divide-gray-200 table-auto border-none text-sm whitespace-nowrap text-gray-900">
			<tbody className="divide-y divide-gray-200">
				{props.attributes.map((d: NftAttribute, index: number) => {
					return (
						<tr key={index}>
							<td className="p-3.5">{d.trait_type}</td>
							<td className="p-3.5">{d.value}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
