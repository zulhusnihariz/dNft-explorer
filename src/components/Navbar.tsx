import { useEffect, useState } from 'react';
import logo from '../assets/lineagelogo.png';
import Dropdown from 'rc-dropdown';
import '../assets/rc-dropdown.css';
import Menu, { MenuItem } from 'rc-menu';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CustomNavLink = ({
	children,
	to,
	className,
}: {
	children: React.ReactNode;
	to: string;
	className: string;
}) => {
	return (
		<NavLink
			to={to}
			className={className}
			style={({ isActive }) => {
				return {
					color: isActive ? '#0784c3' : '#fff',
				};
			}}
		>
			{children}
		</NavLink>
	);
};

const Navbar = () => {
	const [stickyClass, setStickyClass] = useState('relative pt-8');

	useEffect(() => {
		window.addEventListener('scroll', stickNavbar);

		return () => {
			window.removeEventListener('scroll', stickNavbar);
		};
	}, []);

	const stickNavbar = () => {
		if (window !== undefined) {
			let windowHeight = window.scrollY;

			windowHeight > 80
				? setStickyClass(
						'!fixed inset-x-0 z-50 bg-white duration-100 text-[#243c5a]'
				  )
				: setStickyClass('relative pt-8');
		}
	};

	return (
		//
		<header aria-label="SEED Header" className="bg-black">
			<div className="mx-auto w-full flex items-center justify-between">
				<CustomNavLink className="block" to="/">
					<img src={logo} alt="" width={350} height={41} className="" />
				</CustomNavLink>
				<div className="flex gap-4 font-semibold">
					<CustomNavLink className="p-1" to="/txs">
						Transactions
					</CustomNavLink>
					<CustomNavLink className="p-1" to="/search">
					<FontAwesomeIcon icon={faSearch} /> Search 
					</CustomNavLink>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
