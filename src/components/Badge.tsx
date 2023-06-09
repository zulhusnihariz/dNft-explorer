export const Badge = (props: { text: string; className: string }) => {
	return <span className={props.className}>{props.text}</span>;
};
