

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
				<h3> With a fun new way to aim for success  </h3>
				<div id="container">
   					 <button id="sign-in-btn">Sign Up</button>
  			    </div>
			</Container>
		</>
	);
}
