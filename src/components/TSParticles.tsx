import { useCallback } from 'react';
import type { Container, Engine } from 'tsparticles-engine';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

export const TSParticles = () => {
	const particlesInit = useCallback(async (engine: Engine) => {
		// you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		await loadFull(engine);
	}, []);

	const particlesLoaded = useCallback(
		async (container: Container | undefined) => {},
		[]
	);
	return (
		<Particles
			id="tsparticles"
			init={particlesInit}
			loaded={particlesLoaded}
			options={{
				fps_limit: 60,
				interactivity: {
					detectsOn: 'canvas',
					modes: {
						push: { particles_nb: 4 },
						repulse: { distance: 200, duration: 0.4 },
					},
				},
				particles: {
					color: { value: '#fff' },
					links: {
						color: '#fff',
						distance: 150,
						enable: true,
						opacity: 0.4,
						width: 1,
					},
					move: {
						bounce: false,
						direction: 'none',
						enable: true,
						outMode: 'out',
						random: false,
						speed: 2,
						straight: false,
					},
					number: { density: { enable: true, area: 800 }, value: 80 },
					opacity: { value: 0.5 },
					shape: { type: 'circle' },
					size: { random: true, value: 5 },
				},
				detectRetina: true,
			}}
		/>
	);
};
