import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const TEN_MINUTES_IN_MS = 600_000;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: TEN_MINUTES_IN_MS,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	},
});

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);
