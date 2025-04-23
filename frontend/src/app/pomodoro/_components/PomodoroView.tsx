import {Grid2, List, ListItem, ListItemText} from "@mui/material";
import SpacePomodoroTimer from "./PomodoroTimer";
import {PomodoroDTO} from "@/app/pomodoro/pomodoroDTO";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {getActivePomodoro, getALlPomodoroSessions} from "@/app/pomodoro/pomodoroAPIHelpers";

export default function PomodoroView() {

	const [currentSession, setCurrentSession] = useState<PomodoroDTO | null>(null);
	const [previousSessions, setPreviousSessions] = useState<PomodoroDTO[]>([]);


	useEffect(() => {
		// This is where the API call is to get the current pomodoro session
		const fetchCurrentSession = async () => {
			try {
				const data = await getActivePomodoro();
				console.log(data);

				if(data.length == 0 || data == null) {
					setCurrentSession(null);
				} else {
					setCurrentSession(data[0]);
				}

				const sessions = await getALlPomodoroSessions();
				console.log("Sessions" + sessions);
				if (sessions.length === 0) {
					setPreviousSessions([]);
				} else {
					const sortedSessions = sessions
						.sort((a, b) => dayjs(b.finishingTimeStamp).valueOf() - dayjs(a.finishingTimeStamp).valueOf())
						.slice(0, 5);
					setPreviousSessions(sortedSessions);
				}

			} catch (error) {
				console.log(error);
			}
		}
		fetchCurrentSession();
	}, []);

	return (
		<>
			<Grid2 container>
				<Grid2 size={{xs: 12, md: 6}}>
					<SpacePomodoroTimer pomodoroSession={currentSession} />
				</Grid2>
				<Grid2 size={{xs: 12, md: 6}}>
					<h2>Previous Sessions</h2>
					<List>
						{previousSessions.map((session) => (
							<ListItem key={session.sessionId}>
								<ListItemText
									primary={`${session.title} `}
									secondary={`Completed on ${dayjs(session.finishingTimeStamp).format(
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
