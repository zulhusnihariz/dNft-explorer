import './App.css';
import { Routes, Route } from 'react-router-dom';
import { MainExplorer, TransactionsExplorer } from './pages';
import { TSParticles, NavbarLayout } from './components';

function App() {
	return (
		<div className="App">
			<div className="w-full h-screen flex flex-col justify-start ">
				<TSParticles />

				<Routes>
					<Route path="/" element={<NavbarLayout />}>
						<Route index element={<MainExplorer />} />
						<Route
							path="/:address/:tokenId/:chainId"
							element={<MainExplorer />}
						/>
						<Route path="/txs" element={<TransactionsExplorer />} />
					</Route>
				</Routes>
			</div>
		</div>
	);
}

export default App;
