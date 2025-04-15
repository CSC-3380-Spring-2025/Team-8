"use client";

import { Container } from "@mui/material";
import Navbar from "../_global_components/Navbar";
import PomodoroView from "./_components/PomodoroView";
import StarBackground from "@/app/_global_components/StarBackground";
import {useEffect, useState} from "react";
import {PomodoroDTO} from "@/app/pomodoro/pomodoroDTO";

export default function Page() {

	return (
		<>
			<StarBackground/>
			<Navbar />
			<Container>
				<PomodoroView />
			</Container>
		</>
	);
}
