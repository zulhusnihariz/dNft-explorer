export interface Metadatas {
	alias: string;
	cid: string;
	data_key: string;
	public_key: string;
	metadata: {
		err_msg: string;
		history: [];
		metadata: Metadata;
		success: boolean;
	};
	history?: any[];
}

export interface Metadata {
	content: string | any[];
	previous: { [key: string]: string };
	timestamp: number;
	transaction: {
		hash: string;
		meta_contract_id: string;
		method: string;
		timestamp: number;
		value: string;
	};
}

export interface HashFormat {
	address: string;
	tokenId: string;
	chainId: string;
	dataKey: string;
}

export type Transactions = {
	method: string;
	timestamp: number;
	data: any;
	public_key: string;
	alias: string;
	hash: string;
	host_id: string;
	status: number;
	error_text: string;
	nonce: number;
	from_peer_id: string;
	token_id: string;
	token_key: string;
	meta_contract_id: string;
	data_key: string;
};
