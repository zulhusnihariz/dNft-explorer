export interface FdbDht {
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
