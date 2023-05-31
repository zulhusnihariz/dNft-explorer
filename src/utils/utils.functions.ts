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
