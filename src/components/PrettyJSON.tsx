export const PrettyJSON = ({ data }: { data: any }) => (
	<div>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
);
