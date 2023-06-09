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
		<section className="z-2">
			<div className="flex items-center justify-center">
				<div className="absolute flex rounded w-3/4 bg-white p-10 shadow-md items-center top-72">
					<input
						type="text"
						className="w-full bg-white pl-2 border border-grey-500 rounded py-3 mr-2 focus:border-[#747FEB] transition-all duration-300 focus:pl-4"
						placeholder="Token Address"
						name="address"
						value={search.address}
						onChange={onHandleChange}
					/>
					<input
						type="text"
						className="w-1/2 bg-white pl-2 border border-1 rounded border-grey-500  py-3 mr-2 focus:border-[#747FEB] transition-all duration-300 focus:pl-4"
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
			</div>
		</section>
	);
};
