import { useEffect } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRepositories } from '../repositories';
import { useParams } from 'react-router-dom';

import { PrettyJSON } from '../components';

dayjs.extend(relativeTime);

export const TransactionDetails = () => {
	const { hash } = useParams();
	const { useGetTransaction } = useRepositories();
	const { data: tx, refetch } = useGetTransaction(String(hash));

	const card = [
		{
			key: 'method',
			label: () => <p>Method</p>,
			value: () => <p>Method Value</p>,
		},
		{
			key: 'timestamp',
			label: () => <p>Timestamp</p>,
			value: () => <p>Timestamp Value</p>,
		},
		{
			key: 'data',
			label: () => <p>Data</p>,
			value: () => <p>Data Value</p>,
		},
		{
			key: 'public_key',
			label: () => <p>Public Key</p>,
			value: () => <p>Public Key Value</p>,
		},
		{
			key: 'Hash',
			label: () => <p>Hash</p>,
			value: () => <p>Hash Value</p>,
		},
		{
			key: 'host_id',
			label: () => <p>Host ID</p>,
			value: () => <p>Host ID Value</p>,
		},
		{
			key: 'from_peer_id',
			label: () => <p>From Peer ID</p>,
			value: () => <p>From Peer ID Value</p>,
		},
		{
			key: 'token_id',
			label: () => <p>Token ID</p>,
			value: () => <p>Token ID Value</p>,
		},
		{
			key: 'token_key',
			label: () => <p>Token Key</p>,
			value: () => <p>Token Key Value</p>,
		},
		{
			key: 'host_id',
			label: () => <p>Host ID</p>,
			value: () => <p>Host ID Value</p>,
		},
		{
			key: 'meta_contract_id',
			label: () => <p>Meta Contract ID</p>,
			value: () => <p>Meta Contract ID Value</p>,
		},
		{
			key: 'data_key',
			label: () => <p>Data Key </p>,
			value: () => <p>Data Key Value</p>,
		},
	];

	useEffect(() => {
		const hashExists = hash?.length;
		if (hashExists) refetch();
	}, []);

	return (
		<>
			<section className="flex items-center justify-center pb-5 mx-5 md:mx-0">
				<div className="w-full relative block border border-gray-100 p-2 shadow-sm text-left">
					<div className="mt-1 mb-4 sm:items-center sm:justify-between text-left ">
						<div className="text-sm text-gray-600">Transaction Details</div>
						<PrettyJSON data={tx} />
					</div>
				</div>
			</section>
		</>
	);
};
