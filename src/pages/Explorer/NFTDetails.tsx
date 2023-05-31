import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNftDetails } from '../../services';
import { FdbDht, Nft, NftAttribute } from '../../types';
import { capitalizeWords } from '../../utils/utils.functions';

const NftAttributeTable = (props: Nft) => {
	const { attributes } = props;

	return (
		<table className="   text-sm  text-left">
			<tbody className="divide-y divide-gray-200">
				{attributes.map((el: NftAttribute, index: number) => {
					return (
						<tr key={index}>
							<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left border-l-none border-r-none">
								{capitalizeWords(el.trait_type)}
							</td>
							<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left border-l-none border-r-none">
								{el.value}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const NftLink = (props: { url: string }) => {
	return (
		<a href={`${props.url}`} target="_blank" rel="noopener noreferrer">
			{props.url}
		</a>
	);
};

const NFTDetails = () => {
	const [data, setData] = useState<FdbDht[]>([]);

	const [nft, setNft] = useState<Nft>({
		name: '',
		description: '',
		external_url: '',
		attributes: [] as NftAttribute[],
	});

	const params = useParams();

	useEffect(() => {
		const fetch = async () => {
			let { dataKey } = params;
			dataKey = String(dataKey);

			try {
				const { nft, metadatas } = await getNftDetails(dataKey);
				setData(metadatas as FdbDht[]);
				setNft(nft as Nft);
			} catch (e) {
				setData([] as FdbDht[]);
			}
		};

		fetch();
	}, []);

	return (
		<>
			<section className="pt-56">
				<h2 className="text-[#3B566E] text-3xl mb-6">NFT Details</h2>
				<p className="mb-4">From Collection {data[0]?.public_key}</p>

				<table className="m-auto divide-y divide-gray-200 text-sm table-fixed">
					<tbody className="divide-y divide-gray-200">
						{(Object.keys(nft) as Array<keyof Nft>).map(
							(key: keyof Nft, index: number) => {
								return (
									<tr key={index}>
										<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left ">
											{capitalizeWords(key)}
										</td>
										<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left ">
											{key === 'attributes' ? (
												<NftAttributeTable {...nft} />
											) : key.includes('url') ? (
												<NftLink url={`${nft[key]}`} />
											) : (
												nft[key]
											)}
										</td>
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</section>
			<section className=" w-screen items-center justify-center p-5 pt-20">
				<h2 className="text-[#3B566E] text-3xl mb-6">Transactions</h2>
				<table className="min-w-full divide-y divide-gray-200 text-sm table-fixed">
					<thead className="bg-gray-100">
						<tr>
							<th className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
								Public key
							</th>
							<th className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
								Alias
							</th>
							<th className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
								Data key
							</th>
							<th className="w-1/2 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
								CID
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{data.map((d: FdbDht, index: number) => {
							return (
								<tr key={index}>
									<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
										{d.public_key}
									</td>
									<td className="whitespace-nowrap px-4 py-2 text-gray-700">
										{d.alias}
									</td>
									<td className="whitespace-nowrap px-4 py-2 text-gray-700">
										{d.data_key}
									</td>
									<td
										className="whitespace-nowrap px-4 py-2 text-gray-700 cursor-pointer"
										onClick={() => {}}
									>
										{d.cid}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</section>
		</>
	);
};

export default NFTDetails;
