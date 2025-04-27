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
import {PomodoroDTO, PomodoroDTOPost} from "@/app/pomodoro/pomodoroDTO";
import dayjs from "dayjs";
import {
	createPomodoro,
	deletePomodoroSession, resumePomodoroSession,
	updatePomodoroSession,

} from "@/app/pomodoro/pomodoroAPIHelpers";

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
	const secs = (seconds % 60).toString().padStart(2, "0");
	return `${mins}:${secs}`;
};

const containerStyles: SxProps<Theme> = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	color: "#e4d9ff",
};

export default function SpacePomodoroTimer({pomodoroSession} : {pomodoroSession: PomodoroDTO | null}) {
	const [title, setTitle] = useState<string>("");
	const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [session, setSession] = useState<PomodoroDTO | null>(null);

	useEffect(() => {
		if (pomodoroSession) {
			setSession(pomodoroSession);

			// reflect the pomodoro session
			setTitle(pomodoroSession.title);
			const now = dayjs();
			const due = dayjs(pomodoroSession.finishingTimeStamp);

			const diffInSeconds = due.diff(now, "second");

			setSecondsLeft(diffInSeconds > 0 ? diffInSeconds : 0);
			setIsRunning(diffInSeconds > 0); // start running only if time left
		}
	}, [pomodoroSession]);


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

	const resetTimer = async (): Promise<void> => {
		console.log("Resetting timer which the current ID is " + session?.sessionId);

if (session?.sessionId) {
	try {
		await deletePomodoroSession(session.sessionId);
		console.log("Session deleted successfully");
	} catch (error) {
		console.error("Failed to delete session:", error);
	}
}
		setSecondsLeft(25 * 60);
		setIsRunning(false);
	};

	const handlePause = async () => {
		if (session) {
			const newDueTime = dayjs().add(secondsLeft, "second").toISOString();

			const updatedSession: PomodoroDTO = {
				...session,
				finishingTimeStamp: newDueTime,
				isPaused: true
			};

			// Update local session state
			setSession(updatedSession);

			// SEND API REQUEST TO UPDATE BACKEND HERE
			console.log("Pause updating dueTime to:", updatedSession);
			try {
				await updatePomodoroSession(updatedSession);
				console.log("Session successfully updated");
			}catch (error){
				console.error("Failed to update session:",error);
			}

			setIsRunning(false);
		}
	};


	const handleResume = async (sessionId: number) => {
		try {
			const resumedSession = await resumePomodoroSession(sessionId, secondsLeft);

			// @ts-ignore
			if (resumedSession) {
				setSession(resumedSession);
				setIsRunning(true);
			} else {
				console.log(resumedSession);
				alert("Error resuming session. Please try again.");
			}
		} catch (error) {
			console.error("Failed to resume session:", error);
		}
	}

	const handleStart = async () => {
		// default time is 25 minutes, but add 5 seconds to account for server delay.
		const newDueTime = dayjs().add(25, 'minutes').add(5, "seconds");

		const model: PomodoroDTOPost = {
			title: title,
			dueTime: newDueTime.toISOString(),
		};

		if (!model.title) {
			alert("Please enter a title for your pomodoro session.");
			return;
		}

		try {
			const data = await createPomodoro(model);
			console.log("Created pomodoro session:", data);

			// Ideally you would return the data from the backend here.
			setSession({sessionId: data.sessionId, finishingTimeStamp: data.finishingTimeStamp, title: data.title, isPaused: false});

			// start the actual timer.
			setIsRunning(true);
		}catch (e) {
			console.error(e);
			alert("Error creating pomodoro");
		}

	}

	return (
		<Box sx={containerStyles}>
			<Card sx={{ width: 400, bgcolor: "#1a1e33", borderRadius: 4, boxShadow: 6, paddingX: 2, paddingY: 8 }}>
				<CardContent>
					<Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
						AstroFocus 🚀
					</Typography>
					<TextField
						fullWidth
						margin="dense"
						label="Title"
						variant="outlined"
						value={title}
						onChange={handleTitleChange}
						disabled={isRunning}
						sx={{ input: { color: "#e4d9ff" }, label: { color: "#8be9fd" } }}
					/>
					<Box sx={{ textAlign: "center", my: 3 }}>
						<Typography variant="h3">{formatTime(secondsLeft)}</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						{!isRunning && !session?.isPaused && (
							<Button
								variant="contained"
								color="primary"
								onClick={handleStart}
								sx={{ flex: 1, mr: 1 }}
							>
								Start
							</Button>
						)}
						{!isRunning && session?.isPaused && (
							<Button
								variant="contained"
								color="success"
								onClick={() => handleResume(session.sessionId)}
								sx={{ flex: 1, mr: 1 }}
							>
								Resume
							</Button>
						)}
						{isRunning && (
							<Button
								variant="contained"
								color="secondary"
								onClick={handlePause}
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
