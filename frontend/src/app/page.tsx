"use client";

import Navbar from "./_global_components/Navbar";
import StarBackground from "./_global_components/StarBackground";

export default function Home() {
	return (
		<>
			<StarBackground />
			<Navbar />
			<div>
				<h1>Hello World</h1>
			</div>
		</>
	);
}
