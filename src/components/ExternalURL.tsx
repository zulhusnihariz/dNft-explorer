export const ExternalURL = (props: { url: string }) => {
	return (
		<a href={`${props.url}`} target="_blank" className="text-ellipsis">
			{props.url}
		</a>
	);
};
