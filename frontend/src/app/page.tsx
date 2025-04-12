"use client";

import Navbar from "./_global_components/Navbar";
import StarBackground from "./_global_components/StarBackground";
import {Container} from "@mui/material";

export default function Home() {
	return (
		<>
			<StarBackground />
			<Navbar />
			<Container component="main">
				<h1>Launch Your Productivity Into Orbit.</h1>
			</Container>
		</>
	);
}
