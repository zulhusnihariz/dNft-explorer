import { useOutlet } from 'react-router-dom';
import Navbar from '../Navbar';

export const NavbarLayout = () => {
	const outlet = useOutlet();

	return (
		<>
			<Navbar />
			<h1 className="z-10 text-4xl text-white mt-10 font-normal tracking-wide">
				Lineage Explorer
			</h1>
			{outlet}
		</>
	);
};
