import { useState } from 'react';
import { constructDataKey, updateURL } from '../utils/utils.functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useBoundStore } from '../store';
import { useRepositories } from '../repositories';

export const SearchBar = () => {
	const { setHash, resetHistory } = useBoundStore((state) => state);
	const { useGetMetadatasWithHistory } = useRepositories();
	const { refetch } = useGetMetadatasWithHistory();

	const [search, setSearch] = useState({
		address: String(process.env.REACT_APP_COLLABEAT_NFT),
		tokenId: '8',
		chainId: 80001,
	});

	const onSearchClick = async (e: any) => {
		e.preventDefault();

		const args = {
			address: search.address.toLowerCase(),
			tokenId: search.tokenId,
			chainId: String(search.chainId),
		};

		const dataKey = constructDataKey({
			...args,
			nonce: String(process.env.REACT_APP_NONCE),
		});

		let hash = { ...args, dataKey };

		resetHistory();
		setHash(hash);
		refetch();

		const { address, tokenId, chainId } = hash;
		const newPath = `${address}/${tokenId}/${chainId}`;
		updateURL(newPath);
	};

	const onHandleChange = (event: any) => {
		setSearch({
			...search,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<section className="w-3/4 p-5">
			<h1 className="text-xl text-left font-semibold mb-3 text-white">The Lineage Metadata Explorer</h1>
			<div className="flex rounded w-full items-center">
				<input
					type="text"
					className="w-full bg-white pl-2 border border-blue-500 rounded-lg py-3 mr-2 focus:border-[#747FEB] transition-all duration-300 focus:pl-4"
					placeholder="Token Address"
					name="address"
					value={search.address}
					onChange={onHandleChange}
				/>
				<input
					type="text"
					className="w-1/2 bg-white pl-2 border border-1 rounded-lg border-blue-500  py-3 mr-2 focus:border-[#747FEB] transition-all duration-300 focus:pl-4"
					placeholder="Token ID"
					name="tokenId"
					value={search.tokenId}
					onChange={onHandleChange}
				/>

				<button
					className="bg-[#747FEB] px-3 py-2 rounded text-white font-bold hover:bg-blue-800 transition-colors"
					onClick={onSearchClick}
				>
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</div>
		</section>
	);
};
