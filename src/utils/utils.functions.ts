import { solidityPackedKeccak256 } from 'ethers';

export function capitalizeWords(str: string) {
	if (str.includes('_')) {
		const words = str.split('_');

		const capitalizedWords = words.map((word) => {
			const trimmedWord = word.trim();
			const firstChar = trimmedWord.charAt(0).toUpperCase();
			const restOfString = trimmedWord.slice(1).toLowerCase();
			return firstChar + restOfString;
		});

		return capitalizedWords.join(' ');
	}

	const trimmedWord = str.trim();
	const firstChar = trimmedWord.charAt(0).toUpperCase();
	const restOfString = trimmedWord.slice(1).toLowerCase();

	return firstChar + restOfString;
}

export function isUrl(value: string) {
	const urlPattern =
		/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+(?:\/.*)?$/;
	return urlPattern.test(value);
}

export function formatTimestamp(timestamp: number) {
	const date = new Date(timestamp);

	// Extract the individual components of the date
	const month = date.getMonth() + 1; // Months are zero-based, so add 1
	const day = date.getDate();
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Format the components into the desired format
	const formattedTimestamp = `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;

	return formattedTimestamp;
}

export function constructDataKey(format: {
	address: string;
	tokenId: string;
	chainId: string;
	nonce: string;
}) {
	const { address, tokenId, chainId, nonce } = format;
	const input = address.toLowerCase() + tokenId + chainId + nonce;
	return solidityPackedKeccak256(['string'], [input]).substring(2);
}

export function updateURL(newPath: string) {
	const currentUrl = window.location.href;
	const url = new URL(currentUrl);

	url.pathname = newPath;
	const newUrl = url.href;

	window.history.pushState({ path: newUrl }, '', newUrl);
}
