"use client";

import { Container } from "@mui/material";
import Navbar from "../_global_components/Navbar";
import PomodoroView from "./_components/PomodoroView";

export default function Page() {
	return (
		<>
			<Navbar />
			<Container>
				<PomodoroView />
			</Container>
		</>
	);
}
