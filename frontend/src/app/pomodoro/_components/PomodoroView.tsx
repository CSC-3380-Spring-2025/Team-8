import { Grid2 } from "@mui/material";
import SpacePomodoroTimer from "./PomodoroTimer";

export default function PomodoroView() {
	return (
		<Grid2 container>
			<Grid2 size={12}>
				<h1>Pomodoro Timer</h1>
				<SpacePomodoroTimer />
			</Grid2>
		</Grid2>
	);
}
