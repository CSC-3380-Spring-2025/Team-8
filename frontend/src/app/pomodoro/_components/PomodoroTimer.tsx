import React, { useState, useEffect, useRef } from "react";
import {
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Box,
} from "@mui/material";

function PomodoroTimer() {
	const [title, setTitle] = useState("Pomodoro Session");
	const [description, setDescription] = useState("Focus time");
	const [secondsLeft, setSecondsLeft] = useState(25 * 60); // default 25 mins
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef(null);

	// Format time as mm:ss
	const formatTime = (secs: number) => {
		const minutes = Math.floor(secs / 60)
			.toString()
			.padStart(2, "0");
		const seconds = (secs % 60).toString().padStart(2, "0");
		return `${minutes}:${seconds}`;
	};

	// Timer countdown logic
	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				setSecondsLeft((prev) => {
					if (prev === 0) {
						clearInterval(intervalRef.current);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			clearInterval(intervalRef.current);
		}
		return () => clearInterval(intervalRef.current);
	}, [isRunning]);

	const handleReset = () => {
		setIsRunning(false);
		setSecondsLeft(25 * 60);
	};

	return (
		<Card
			sx={{
				maxWidth: 400,
				margin: "auto",
				mt: 4,
				textAlign: "center",
				p: 2,
			}}
		>
			<CardContent>
				<TextField
					label="Title"
					fullWidth
					variant="outlined"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					sx={{ mb: 2 }}
				/>
				<TextField
					label="Description"
					fullWidth
					variant="outlined"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					sx={{ mb: 3 }}
				/>
				<Typography
					variant="h3"
					gutterBottom
				>
					{formatTime(secondsLeft)}
				</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						gap: 2,
						mt: 2,
					}}
				>
					<Button
						variant="contained"
						color={isRunning ? "warning" : "primary"}
						onClick={() => setIsRunning(!isRunning)}
					>
						{isRunning ? "Pause" : "Start"}
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						onClick={handleReset}
					>
						Reset
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
}

export default PomodoroTimer;
