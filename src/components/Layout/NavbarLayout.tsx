import { useOutlet } from 'react-router-dom';
import Navbar from '../Navbar';

export const NavbarLayout = () => {
	const outlet = useOutlet();

	return (
		<>
			<Navbar />
			{outlet}
		</>
	);
};
