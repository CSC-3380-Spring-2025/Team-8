import { Grid2 } from "@mui/material";
import PomodoroTimer from "./PomodoroTimer";

export default function PomodoroView() {
	return (
		<Grid2 container>
			<Grid2 size={12}>
				<h1>Pomodoro Timer</h1>
				<h3>Stay focused and productive!</h3>
				<PomodoroTimer />
			</Grid2>
		</Grid2>
	);
}
