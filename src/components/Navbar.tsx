import { useEffect } from 'react';
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
	// get the sticky element
	useEffect(() => {
		const stickyElm = document.querySelector('header');

		const observer = new IntersectionObserver(
			([e]) => e.target.classList.toggle('isSticky', e.intersectionRatio < 1),
			{ threshold: [1] }
		);

		observer.observe(stickyElm as HTMLElement);
	});

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
		<header aria-label="SEED Header pt-2 h-20">
			<div className=" mx-auto max-w-screen-xl flex h-20 items-center justify-between">
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
