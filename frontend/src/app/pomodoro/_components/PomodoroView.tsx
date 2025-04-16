import {Grid2, List, ListItem, ListItemText} from "@mui/material";
import SpacePomodoroTimer from "./PomodoroTimer";
import {PomodoroDTO} from "@/app/pomodoro/pomodoroDTO";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {getActivePomodoro} from "@/app/pomodoro/pomodoroAPIHelpers";

export default function PomodoroView() {

	const [currentSession, setCurrentSession] = useState<PomodoroDTO | null>(null);
	const [previousSessions, setPreviousSessions] = useState<PomodoroDTO[]>([]);

	const fakePomodoroSessions: PomodoroDTO[] = [
		{
			sessionId: 1,
			dueTime: "2025-04-13T14:25:00.000Z",
			title: "Write project summary",
			isPaused: false
		},
		{
			sessionId: 2,
			dueTime: "2025-04-12T20:15:00.000Z",
			title: "Refactor PomodoroTimer component",
			isPaused: false
		},
		{
			sessionId: 3,
			dueTime: "2025-04-12T17:30:00.000Z",
			title: "Midterm review - Data Structures",
			isPaused: false
		},
		{
			sessionId: 4,
			dueTime: "2025-04-11T22:45:00.000Z",
			title: "Design StudyVerse UI mockups",
			isPaused: false
		},
		{
			sessionId: 5,
			dueTime: "2025-04-11T19:00:00.000Z",
			title: "Clean up API controller logic",
			isPaused: false
		},
		{
			sessionId: 6,
			dueTime: "2025-04-10T16:10:00.000Z",
			title: "Write unit tests for backend",
			isPaused: false
		},
		{
			sessionId: 7,
			dueTime: "2025-04-09T12:40:00.000Z",
			title: "Catch up on stats lecture",
			isPaused: false
		},
		{
			sessionId: 8,
			dueTime: "2025-04-09T09:20:00.000Z",
			title: "Write dev journal entry",
			isPaused: false
		},
		{
			sessionId: 9,
			dueTime: "2025-04-08T18:30:00.000Z",
			title: "Sprint planning with team",
			isPaused: false
		},
		{
			sessionId: 10,
			dueTime: "2025-04-08T08:55:00.000Z",
			title: "Morning debugging session",
			isPaused: false
		},
	];



	useEffect(() => {
		// This is where the API call is to get the current pomodoro session
		const fetchCurrentSession = async () => {
			try {
				const data = await getActivePomodoro();

				if(data.length == 0 || data == null) {
					setCurrentSession(null);
				}
				setCurrentSession(data[0]);
			} catch (error) {
				console.log(error);
			}
		}
		fetchCurrentSession();
	}, []);

	useEffect(() => {
		const prevSessions = fakePomodoroSessions
			.sort((a, b) => dayjs(b.dueTime).valueOf() - dayjs(a.dueTime).valueOf())
			.slice(0, 5);

		setPreviousSessions(prevSessions);
	}, []);

	return (
		<>
			<Grid2 container>
				<Grid2 size={{xs: 12, md: 6}}>
					<SpacePomodoroTimer pomodoroSession={null} />
				</Grid2>
				<Grid2 size={{xs: 12, md: 6}}>
					<h2>Previous Sessions</h2>
					<List>
						{previousSessions.map((session) => (
							<ListItem key={session.sessionId}>
								<ListItemText
									primary={`${session.title} `}
									secondary={`Completed on ${dayjs(session.dueTime).format(
										"MMM D, YYYY @ h:mm a"
									)}`}
									sx={{ marginLeft: 2, color: "black" }}
								/>
							</ListItem>
						))}
					</List>
				</Grid2>
			</Grid2>
		</>
	);
}
