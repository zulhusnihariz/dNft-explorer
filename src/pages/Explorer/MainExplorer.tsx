import { solidityPackedKeccak256 } from 'ethers';
import { useState } from 'react';
import Modal from 'react-modal';
import { get_content_from_cid, generate_new_keypair } from '../../_aqua/fdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getMetadatasWithHistory } from '../../services';
import { FdbDht, NftAttribute } from '../../types';
import { NftAttributeTable } from '../../components';
import { isUrl } from '../../utils/utils.functions';

interface KeyPair {
	pk: string;
	sk: string;
}

interface HashFormat {
	address: string;
	tokenId: string;
	chainId: string;
	dataKey: string;
}

const NftLink = (props: { url: string }) => {
	return (
		<a href={`${props.url}`} target="_blank">
			{props.url}
		</a>
	);
};

const MetadataContent = (props: { data: FdbDht }) => {
	const { data } = props;
	const { alias } = data;
	const { content } = data.metadata.metadata;
	const contentString = String(content);
	return (
		<>
			{alias === 'attributes' ? (
				<NftAttributeTable attributes={content as NftAttribute[]} />
			) : isUrl(contentString) ? (
				<NftLink url={contentString} />
			) : (
				content
			)}
		</>
	);
};

const MainExplorer = () => {
	const [isAddOpen, setAddDataOpen] = useState(false);
	const [isNewOpen, setNewColOpen] = useState(false);
	const [isCIDOpen, setCIDOpen] = useState(false);
	const [data, setData] = useState<FdbDht[]>([]);
	const [content, setContent] = useState<string>('');
	const [selectedCid, setSelectedCid] = useState('');
	const [keypair, setKeypair] = useState<KeyPair>();

	const [hash, setHash] = useState<HashFormat>({
		address: '',
		tokenId: '',
		chainId: '',
		dataKey: '',
	});

	const addDataModalStyles = {
		content: {
			width: '50%',
			height: '75%',
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
	};

	const modalStyles = {
		content: {
			width: '50%',
			height: '45%',
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
	};

	const [search, setSearch] = useState({
		address: String(process.env.REACT_APP_COLLABEAT_NFT),
		tokenId: '8',
		chainId: 80001,
	});

	const updateURL = (hash: HashFormat) => {
		const currentUrl = window.location.href;

		const url = new URL(currentUrl);

		const { address, tokenId, chainId } = hash;
		const newPath = `${address}/${tokenId}/${chainId}`;
		url.pathname = newPath;

		const newUrl = url.href;
		window.history.pushState({ path: newUrl }, '', newUrl);
	};

	const onSearchClick = async (e: any) => {
		e.preventDefault();

		const input =
			search.address.toLowerCase() + search.tokenId + search.chainId + 0;
		const dataKey = solidityPackedKeccak256(['string'], [input]).substring(2);

		let hash = {
			address: search.address,
			tokenId: search.tokenId,
			chainId: String(search.chainId),
			dataKey,
		};

		updateURL(hash);
		setHash(hash);

		try {
			let metadatas = await getMetadatasWithHistory(dataKey);
			setData(metadatas as FdbDht[]);
		} catch (e) {
			setData([] as FdbDht[]);
		}
	};

	const onHandleChange = (event: any) => {
		setSearch({
			...search,
			[event.target.name]: event.target.value,
		});
	};

	const onClickCid = async (cid: string) => {
		const content = await get_content_from_cid(cid);
		setCIDOpen(true);
		setSelectedCid(cid);
		setContent(content[0].data);
	};

	const onCidOk = async () => {
		setCIDOpen(false);
		setContent('');
	};

	const onGenerateKey = async () => {
		const keypair = await generate_new_keypair();
		setKeypair(keypair as KeyPair);
	};

	return (
		<>
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
						{/* <input
							type="text"
							className="w-1/2 bg-white pl-2 border border-1 rounded border-grey-500 py-3 mr-2 focus:border-[#747FEB] transition-all duration-300 focus:pl-4"
							placeholder="Chain ID"
							name="chainId"
							value={search.chainId}
							onChange={onHandleChange}
						/> */}
						<button
							className="bg-[#747FEB] px-3 py-2 rounded text-white font-bold hover:bg-blue-800 transition-colors"
							onClick={onSearchClick}
						>
							<FontAwesomeIcon icon={faSearch} />
						</button>
					</div>
				</div>
			</section>

			<section className="flex w-screen items-center justify-center p-5 pt-48">
				<div className="w-full relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
						<div className="text-sm text-gray-600">
							{data.length > 0 && (
								<p>
									Metadata for data key: <b>{hash.dataKey}</b>
								</p>
							)}
						</div>
						<div className="text-sm text-gray-600">
							Total {data.length} datasets
						</div>
					</div>
					<table className="min-w-full divide-y divide-gray-200 text-sm table-fixed">
						<thead className="bg-gray-100">
							<tr>
								<th className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
									Public Key
								</th>
								<th className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
									Alias
								</th>
								<th className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
									Content
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
										<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											{d.alias.length > 0 ? d.alias : 'beat'}
										</td>
										<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											<MetadataContent data={d} />
										</td>
										<td
											className="whitespace-nowrap px-4 py-2 text-gray-700 cursor-pointer"
											onClick={() => onClickCid(d.cid)}
										>
											{d.cid}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>

			{/* --------------- ADD DATABASE MODAL ------------  */}
			<Modal
				isOpen={isAddOpen}
				onRequestClose={() => setAddDataOpen(false)}
				ariaHideApp={false}
				style={addDataModalStyles}
			>
				<div className="flex justify-between my-3">
					<h1>Add Database</h1>
					<button onClick={() => setAddDataOpen(false)}>X</button>
				</div>
				<form>
					<div className=" mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							Key
						</label>
						<input
							type="text"
							className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							placeholder="Key..."
						/>
					</div>
					<div className="mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							Public Key
						</label>
						<input
							type="text"
							className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							placeholder="Enter public key"
						/>
					</div>
					<div className="mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							Message
						</label>
						<textarea
							className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							placeholder="Enter message ..."
						/>
					</div>
					<div className="mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							Signature
						</label>
						<textarea
							className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							placeholder="Signature"
						/>
					</div>
					<div className="mt-8 flex justify-center ">
						<button
							type="submit"
							className="bg-green-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-green-800 transition-colors"
						>
							Add
						</button>
					</div>
				</form>
			</Modal>

			{/* --------------- NEW COLLECTION MODAL ------------  */}
			<Modal
				isOpen={isNewOpen}
				onRequestClose={() => setNewColOpen(false)}
				ariaHideApp={false}
				style={modalStyles}
			>
				<div className="flex justify-between my-3">
					<h1>New Collection</h1>
					<button onClick={() => setNewColOpen(false)}>X</button>
				</div>
				<form>
					<div className="mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							Public Key
						</label>
						<input
							type="text"
							className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							value={keypair?.pk}
						/>
					</div>
					<div className="mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							Secret Key
						</label>
						<input
							type="text"
							className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							value={keypair?.sk}
						/>
					</div>
					<div className="mt-8 flex justify-center ">
						<button
							type="button"
							className="bg-green-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-green-800 transition-colors"
							onClick={onGenerateKey}
						>
							Generate
						</button>
					</div>
				</form>
			</Modal>

			{/* --------------- CID MODAL ------------  */}
			<Modal
				isOpen={isCIDOpen}
				onRequestClose={() => setCIDOpen(false)}
				ariaHideApp={false}
				style={modalStyles}
			>
				<div className="flex justify-between my-3">
					<h1>CID</h1>
					<button onClick={() => setCIDOpen(false)}>X</button>
				</div>
				<form>
					<div className="mb-2 text-left pr-4">
						<label
							htmlFor="text"
							className="block text-sm font-semibold text-gray-800"
						>
							CID: {selectedCid}
						</label>
						<textarea
							className="h-36 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
							placeholder="CID"
							value={content}
						/>
					</div>
					<div className="mt-8 flex justify-center ">
						<button
							type="button"
							className="bg-green-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-green-800 transition-colors"
							onClick={onCidOk}
						>
							Ok
						</button>
					</div>
				</form>
			</Modal>

			{/* {cidModalVisible && <Popup />} */}
		</>
	);
};

export default MainExplorer;
