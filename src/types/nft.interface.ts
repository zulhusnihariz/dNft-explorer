export interface NftAttribute {
	display_type?: string;
	trait_type: string;
	value: number | string;
}

export interface Nft {
	name: string;
	external_url: string;
	description: string;
	image?: string;
	attributes: NftAttribute[];
}
