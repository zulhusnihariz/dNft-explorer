import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainExplorer from './pages/Explorer/MainExplorer';
import { TSParticles, NavbarLayout } from './components';
import NFTDetails from './pages/Explorer/NFTDetails';

function App() {
	return (
		<div className="App">
			<div className="w-full h-screen flex flex-col justify-start ">
				<TSParticles />

				<Routes>
					<Route path="/" element={<NavbarLayout />}>
						<Route index element={<MainExplorer />} />
						<Route path="/nft/:dataKey" element={<NFTDetails />} />
					</Route>
				</Routes>
			</div>
		</div>
	);
}

export default App;
