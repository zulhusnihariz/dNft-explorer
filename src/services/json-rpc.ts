import axios from 'axios';
import { FdbDht, Nft } from '../types';

const jsonrpc = axios.create({
	baseURL: process.env.REACT_APP_JSON_RPC_URL,
	timeout: 5000,
});

export type JSONRPCResponse = {
	id: string;
	jsonrpc: string;
	result: any;
};

export const getMetadatas = async (dataKey: string) => {
	const { data } = await jsonrpc({
		method: 'post',
		data: {
			jsonrpc: '2.0',
			method: 'get_metadatas',
			params: [dataKey],
			id: 'string',
		},
	});
	return data as JSONRPCResponse;
};

export const getMetadataWithHistory = async (args: {
	dataKey: string;
	publicKey: string;
	alias: string;
}) => {
	const { data } = await jsonrpc({
		method: 'post',
		data: {
			jsonrpc: '2.0',
			method: 'get_metadata_with_history',
			params: [args.dataKey, args.publicKey, args.alias],
			id: 'string',
		},
	});
	return data as JSONRPCResponse;
};

export const getNftDetails = async (dataKey: string) => {
	const { data } = await jsonrpc({
		method: 'post',
		data: {
			jsonrpc: '2.0',
			method: 'get_metadatas',
			params: [dataKey],
			id: 'string',
		},
	});

	const metadatas = data.result.metadatas;

	let nft: { [key: string]: any } = {
		name: '',
		description: '',
		attributes: '',
		external_url: '',
		animation_url: '',
		image: '',
	};

	const promises = metadatas.map(async (el: FdbDht) => {
		if (!el.alias) return;

		let res = await getMetadataWithHistory({
			dataKey: el.data_key,
			publicKey: el.public_key,
			alias: el.alias,
		});

		const metadata = JSON.parse(res.result.metadata);

		nft[el.alias] = metadata.content;
	});

	await Promise.all(promises);

	return { nft, metadatas } as { nft: Nft; metadatas: FdbDht[] };
};
