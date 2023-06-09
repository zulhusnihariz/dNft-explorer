import './App.css';
import { Routes, Route } from 'react-router-dom';
import { MainExplorer, TransactionsExplorer } from './pages';
import { TSParticles, NavbarLayout } from './components';

function App() {
	return (
		<div className="App">
			<NavbarLayout />
			<TSParticles />
			<div className="w-full max-w-[1400px] mx-auto px-auto h-screen flex flex-col justify-start ">
				<Routes>
					<Route index element={<MainExplorer />} />
					<Route
						path="/:address/:tokenId/:chainId"
						element={<MainExplorer />}
					/>
					<Route path="/txs" element={<TransactionsExplorer />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
