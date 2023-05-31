import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { generate_new_keypair } from '../../_aqua/fdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getMetadatasWithHistory } from '../../services';
import { FdbDht, NftAttribute } from '../../types';
import { NftAttributeTable } from '../../components';
import {
	constructDataKey,
	formatTimestamp,
	isUrl,
} from '../../utils/utils.functions';

import { useParams } from 'react-router-dom';

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
		<a href={`${props.url}`} target="_blank" className="text-ellipsis">
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

const PrettyJSON = ({ data }: { data: any }) => (
	<div>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
);

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

	const [history, setHistory] = useState<{ alias: string; data: [] }>({
		alias: '',
		data: [],
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

	async function fetchMetadatas(args: Omit<HashFormat, 'dataKey'>) {
		const dataKey = constructDataKey({
			...args,
			nonce: String(process.env.REACT_APP_NONCE),
		});

		try {
			let metadatas = await getMetadatasWithHistory(dataKey);
			setData(metadatas as FdbDht[]);
		} catch (e) {
			setData([] as FdbDht[]);
		}

		let hash = { ...args, dataKey };
		setHash(hash);
	}

	const includeHashInURL = (hash: HashFormat) => {
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

		await fetchMetadatas({
			address: search.address.toLowerCase(),
			tokenId: search.tokenId,
			chainId: String(search.chainId),
		});
	};

	const onHandleChange = (event: any) => {
		setSearch({
			...search,
			[event.target.name]: event.target.value,
		});
	};

	const onClickCid = async (d: FdbDht) => {
		const { alias, metadata } = d;
		const { history } = metadata;

		let data = { alias, data: history };
		setHistory(data);
	};

	const onCidOk = async () => {
		setCIDOpen(false);
		setContent('');
	};

	const onGenerateKey = async () => {
		const keypair = await generate_new_keypair();
		setKeypair(keypair as KeyPair);
	};

	useEffect(() => {
		if (hash.dataKey) includeHashInURL(hash);
	}, [hash.dataKey]);

	const { address, tokenId, chainId } = useParams();

	useEffect(() => {
		const fetch = async () => {
			const paramsExists = address && tokenId && chainId;

			if (paramsExists) {
				await fetchMetadatas({ address, tokenId, chainId });
			}
		};

		fetch();
	}, []);

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
							Metadata for data key: <b>{hash.dataKey}</b>
						</div>
						<div className="text-sm text-gray-600">
							Total {data.length} datasets
						</div>
					</div>

					<div className="overflow-x overflow-scroll">
						<table className="min-w-full table-fixed text-left text-sm text-gray-900 whitespace-nowrap">
							<thead>
								<tr>
									<th className="w-1  p-2 ">Public Key</th>
									<th className="w-1 p-2 ">Alias</th>
									<th className="w-1 p-2 ">Content</th>
									<th className="w-1/2 p-2 ">CID</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.map((d: FdbDht, index: number) => {
									const classes =
										index % 2 === 0 ? 'p-3.5 bg-slate-100' : 'p-3.5';
									return (
										<tr key={index}>
											<td className={classes}>{d.public_key}</td>
											<td className={classes}>{d.alias}</td>
											<td className={` ${classes}`}>
												<MetadataContent data={d} />
											</td>
											<td
												className={`${classes} cursor-pointer text-gray-700`}
												onClick={() => onClickCid(d)}
											>
												{d.cid}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<section className="flex w-screen items-center justify-center p-5">
				<div className="w-full relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
						<div className="text-sm text-gray-600">
							<p>
								History for alias: <b>{history.alias}</b>
							</p>
						</div>
						<div className="text-sm text-gray-600">
							Total {history.data.length} history
						</div>
					</div>
					<div className="overflow-x overflow-scroll">
						<table className="min-w-full table-fixed text-left text-sm text-gray-900 whitespace-nowrap">
							<thead>
								<tr>
									<th className="w-1  p-3.5 ">Transaction</th>
									<th className="w-1  p-3.5 ">Content</th>
									<th className="w-1  p-3.5 ">Previous</th>
									<th className="w-1/2  p-3.5 ">Date/Time</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{history.data.map((d: any, index: number) => {
									const classes =
										index % 2 === 0 ? '  p-3.5  bg-slate-100' : '  p-3.5 ';
									return (
										<tr key={index}>
											<td className={`${classes}`}>
												<PrettyJSON data={d.transaction} />
											</td>
											<td className={` ${classes}`}>
												{isUrl(d.content) ? (
													<NftLink url={d.content} />
												) : typeof d.content === 'string' ? (
													d.content
												) : (
													<PrettyJSON data={d.content} />
												)}
											</td>
											<td className={classes}>
												<PrettyJSON data={d.previous} />
											</td>
											<td className={`${classes}`}>
												{formatTimestamp(d.timestamp)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
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
