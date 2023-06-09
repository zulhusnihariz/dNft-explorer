import './App.css';
import { Routes, Route } from 'react-router-dom';
import {
	MainExplorer,
	TransactionDetails,
	TransactionsExplorer,
} from './pages';
import { TSParticles, NavbarLayout } from './components';

function App() {
	return (
		<div className="App">
			<div className="h-[440px]">
				<NavbarLayout />
				<TSParticles />
			</div>
			<div className="w-full md:max-w-[70%] mx-auto px-auto h-screen flex flex-col justify-start ">
				<Routes>
					<Route index element={<MainExplorer />} />
					<Route
						path="/:address/:tokenId/:chainId"
						element={<MainExplorer />}
					/>
					<Route path="/txs" element={<TransactionsExplorer />} />
					<Route path="/tx/:hash" element={<TransactionDetails />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
