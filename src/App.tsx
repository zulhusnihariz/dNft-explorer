import './App.css';
import { Routes, Route } from 'react-router-dom';
import {
	MainExplorer,
	TransactionDetails,
	TransactionsExplorer,
} from './pages';
import { NavbarLayout } from './components';

function App() {
	return (
		<div className="App h-screen h-full">
			<NavbarLayout />
			<div className="container mx-auto">
				<Routes>
					<Route element={<MainExplorer />} path="search" />
					<Route
						path="/:address/:tokenId/:chainId"
						element={<MainExplorer />}
					/>
					<Route index path="/txs" element={<TransactionsExplorer />} />
					<Route path="/tx/:hash" element={<TransactionDetails />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
