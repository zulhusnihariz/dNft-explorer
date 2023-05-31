import { NftAttribute } from '../../types';
export const NftAttributeTable = (props: { attributes: NftAttribute[] }) => {
	return (
		<table className="divide-y divide-gray-200 text-sm ">
			<tbody className="divide-y divide-gray-200">
				{props.attributes.map((d: NftAttribute, index: number) => {
					return (
						<tr key={index}>
							<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
								{d.trait_type}
							</td>
							<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
								{d.value}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
