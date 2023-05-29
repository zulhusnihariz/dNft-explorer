import { useEffect } from 'react';
import logo from '../assets/lineagelogo.png';
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

	return (
		<header aria-label="SEED Header pt-2">
			<div className=" mx-auto max-w-screen-xl flex h-20 items-center justify-between">
				<a className="block " href="/">
					<img src={logo} alt="" width={350} height={41} className="" />
				</a>
				<div className="flex gap-4 font-semibold text-sm ">
					<h4 className="cursor-pointer">HOME</h4>
					<h4 className="cursor-pointer">MIGRATE TO LINEAGE</h4>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
