import React, { useEffect, useState } from "react";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "fullcalendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Tooltip,
} from "@mui/material";
import { CalendarEventDto } from "@/app/tasks/taskDtos";
import { EventInput } from "fullcalendar";
import { EditCalendar } from "@mui/icons-material";

interface CalendarComponentProps {
	initialEvents: CalendarEventDto[];
	editable?: boolean;
}

export default function CalendarComponent({
	initialEvents,
	editable = true,
}: CalendarComponentProps) {
	const [events, setEvents] = useState<EventInput[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [isAddMode, setIsAddMode] = useState<boolean>(false); // Controls form editability
	const [eventForm, setEventForm] = useState<CalendarEventDto>({
		id: 0,
		title: "",
		eventDate: "",
		eventType: "",
		description: "",
	});
	const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);

	useEffect(() => {
		const mappedEvents: EventInput[] = initialEvents.map((event) => ({
			title: event.title,
			start: event.eventDate,
			extendedProps: {
				description: event.description,
				eventType: event.eventType,
			},
		}));
		setEvents(mappedEvents);
	}, [initialEvents]);

	const openAddEventModal = () => {
		setEventForm({
			id: 0,
			title: "",
			eventDate: new Date().toISOString().split("T")[0],
			eventType: "",
			description: "",
		});
		setSelectedEvent(null);
		setIsAddMode(true);
		setOpen(true);
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		setEventForm({
			id: 0,
			title: clickInfo.event.title,
			eventDate: clickInfo.event.startStr,
			description: clickInfo.event.extendedProps.description || "",
			eventType: clickInfo.event.extendedProps.eventType || "",
		});
		//@ts-ignore
		setSelectedEvent(clickInfo.event);
		setIsAddMode(false); // Read-only mode
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setEventForm({
			id: 0,
			title: "",
			eventDate: "",
			eventType: "",
			description: "",
		});
		setSelectedEvent(null);
		setIsAddMode(false);
	};

	const handleSaveEvent = () => {
		if (!isAddMode) return;

		setEvents((prevEvents) => [
			...prevEvents,
			{
				title: eventForm.title,
				start: eventForm.eventDate,
				extendedProps: {
					description: eventForm.description,
					eventType: eventForm.eventType,
				},
			},
		]);
		handleClose();
	};

	const handleDeleteEvent = () => {
		if (selectedEvent) {
			setEvents((prevEvents) =>
				prevEvents.filter((evt) => evt !== selectedEvent)
			);
		}
		handleClose();
	};

	return (
		<div className="p-4">
			<Tooltip
				title="Add Event"
				onClick={openAddEventModal}
				style={{ cursor: "pointer" }}
			>
				<EditCalendar />
			</Tooltip>

			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				eventClick={handleEventClick}
				events={events}
				height="auto"
			/>

			<Dialog
				open={open}
				onClose={handleClose}
			>
				<DialogTitle>
					{isAddMode ? "Add New Event" : "Event Details"}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Event Title"
						type="text"
						fullWidth
						variant="standard"
						value={eventForm.title}
						onChange={(e) =>
							setEventForm({
								...eventForm,
								title: e.target.value,
							})
						}
						disabled={!isAddMode}
					/>
					<TextField
						margin="dense"
						label="Date"
						type="text"
						fullWidth
						variant="standard"
						value={eventForm.eventDate}
						disabled
					/>
					<TextField
						margin="dense"
						label="Description"
						type="text"
						fullWidth
						variant="standard"
						value={eventForm.description}
						onChange={(e) =>
							setEventForm({
								...eventForm,
								description: e.target.value,
							})
						}
						disabled={!isAddMode}
					/>
					<TextField
						margin="dense"
						label="Event Type"
						type="text"
						fullWidth
						variant="standard"
						value={eventForm.eventType}
						onChange={(e) =>
							setEventForm({
								...eventForm,
								eventType: e.target.value,
							})
						}
						disabled={!isAddMode}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
					{editable && !isAddMode && (
						<Button
							onClick={handleDeleteEvent}
							color="error"
						>
							Delete
						</Button>
					)}
					{editable && isAddMode && (
						<Button onClick={handleSaveEvent}>Add</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}
