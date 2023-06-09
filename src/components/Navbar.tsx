import { useEffect, useState } from 'react';
import logo from '../assets/lineagelogo.png';
import Dropdown from 'rc-dropdown';
import '../assets/rc-dropdown.css';
import Menu, { MenuItem } from 'rc-menu';
import { NavLink } from 'react-router-dom';
import { ArrowIcon } from '../assets/icons';

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
					color: isActive ? '#0784c3' : '',
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

	const menuItems = [
		<MenuItem
			key="txs"
			className="border-t-4 border-[#6E7DD6] hover:bg-[#E9ECEF] py-1"
			onClick={() => console.log('tx clicked')}
		>
			<CustomNavLink to="/txs" className="px-8 active:text-red">
				Transactions
			</CustomNavLink>
		</MenuItem>,
	];

	return (
		//
		<header aria-label="SEED Header" className={`${stickyClass}`}>
			<div className=" mx-auto w-full max-w-[70%] flex items-center justify-between">
				<CustomNavLink className="block" to="/">
					<img src={logo} alt="" width={350} height={41} className="" />
				</CustomNavLink>
				<div className="flex gap-4 font-semibold text-sm ">
					<CustomNavLink className="p-1 " to="/">
						HOME
					</CustomNavLink>
					<h4 className="p-1 cursor-pointer">
						<Dropdown overlay={<Menu>{menuItems}</Menu>}>
							<button className="flex">
								NFTs <ArrowIcon />
							</button>
						</Dropdown>
					</h4>
					<h4 className="p-1 cursor-pointer">MIGRATE TO LINEAGE</h4>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
