import React, { useState, useEffect, ChangeEvent } from "react";
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Box,
	SxProps,
	Theme,
} from "@mui/material";

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
	const secs = (seconds % 60).toString().padStart(2, "0");
	return `${mins}:${secs}`;
};

const containerStyles: SxProps<Theme> = {
	display: "flex",
	justifyContent: "center",
	// alignItems: "center",
	// minHeight: "100vh",
	color: "#e4d9ff",
};

export default function SpacePomodoroTimer() {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isRunning) {
			interval = setInterval(() => {
				setSecondsLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
			}, 1000);
		} else if (!isRunning && interval !== null) {
			clearInterval(interval);
		}
		return () => {
			if (interval !== null) clearInterval(interval);
		};
	}, [isRunning]);

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setTitle(e.target.value);
	};

	const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setDescription(e.target.value);
	};

	const resetTimer = (): void => {
		setSecondsLeft(25 * 60);
		setIsRunning(false);
	};

	return (
		<Box sx={containerStyles}>
			<Card sx={{ width: 400, bgcolor: "#1a1e33", borderRadius: 4, boxShadow: 6 }}>
				<CardContent>
					<Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
						🚀 Space Pomodoro
					</Typography>
					<TextField
						fullWidth
						margin="dense"
						label="Title"
						variant="outlined"
						value={title}
						onChange={handleTitleChange}
						sx={{ input: { color: "#e4d9ff" }, label: { color: "#8be9fd" } }}
					/>
					<Box sx={{ textAlign: "center", my: 3 }}>
						<Typography variant="h3">{formatTime(secondsLeft)}</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						{!isRunning && (
							<Button
								variant="contained"
								color="primary"
								onClick={() => setIsRunning(true)}
								sx={{ flex: 1, mr: 1 }}
							>
								Start
							</Button>
						)}
						{isRunning && (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setIsRunning(false)}
								sx={{ flex: 1, mr: 1 }}
							>
								Pause
							</Button>
						)}
						<Button
							variant="outlined"
							color="error"
							onClick={resetTimer}
							sx={{ flex: 1, ml: 1 }}
						>
							Reset
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
