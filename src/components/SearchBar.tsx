import { useState } from 'react';
import { Metadatas } from '../types';
import { constructDataKey } from '../utils/utils.functions';
import { getMetadatasWithHistory } from '../services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useBoundStore } from '../store';

export const SearchBar = () => {
	const setHash = useBoundStore((state) => state.setHash);
	const setMetadatas = useBoundStore((state) => state.setMetadatas);

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
		setHash(hash);

		try {
			let metadatas = await getMetadatasWithHistory(dataKey);
			setMetadatas(metadatas as Metadatas[]);
		} catch (e) {
			setMetadatas([] as Metadatas[]);
		}
	};

	const onHandleChange = (event: any) => {
		setSearch({
			...search,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<section className="z-2">
			<div className="flex w-screen items-center justify-center p-5">
				<h1 className="z-50 text-4xl text-white mt-10 mb-20 font-normal tracking-wide">
					Lineage Explorer
				</h1>
				<div className="absolute flex w-full rounded w-3/4 bg-white p-10 shadow-md items-center top-72">
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
