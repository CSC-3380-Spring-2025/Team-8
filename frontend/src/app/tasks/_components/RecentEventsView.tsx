import { CalendarEventDto } from "@/app/tasks/taskDtos";
import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function RecentEventsView({
	initialEvents,
}: {
	initialEvents: CalendarEventDto[];
}) {
	const [sortedEvents, setSortedEvents] = useState<CalendarEventDto[]>([]);

	useEffect(() => {
		const sorted = [...initialEvents]
			.sort((a, b) => {
				return (
					dayjs(a.eventDate).valueOf() - dayjs(b.eventDate).valueOf()
				);
			})
			.slice(0, 5);
		setSortedEvents(sorted);
	}, [initialEvents]);

	return (
		<>
			<List>
				{sortedEvents.map((event, index) => (
					<ListItem
						key={event.id}
						sx={{
							padding: 2,
							color: "black",
						}}
					>
						<ListItemText
							primary={`${event.title} - ${event.eventDate}`}
							secondary={event.description}
						/>
					</ListItem>
				))}
			</List>
		</>
	);
}
