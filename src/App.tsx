import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainExplorer from './pages/Explorer/MainExplorer';
import NavbarLayout from './components/Layout/NavbarLayout';

function App() {
	return (
		<div className="App">
			<div className="w-full h-screen flex flex-col justify-start ">
				<Routes>
					<Route path="/" element={<NavbarLayout />}>
						<Route index element={<MainExplorer />} />
					</Route>
				</Routes>
			</div>
		</div>
	);
}

export default App;
