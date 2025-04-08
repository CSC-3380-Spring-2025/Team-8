import React, {useEffect, useState} from "react";
import {DateClickArg} from "@fullcalendar/interaction";
import EventApi from "@fullcalendar/react";
import {EventClickArg} from "fullcalendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {CalendarEventDto} from "@/app/tasks/taskDtos";
import {EventInput} from "fullcalendar";

interface CalendarComponentProps {
    initialEvents: CalendarEventDto[];
    editable?: boolean;
}

export default function CalendarComponent({ initialEvents, editable = false }: CalendarComponentProps) {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [eventForm, setEventForm] = useState<CalendarEventDto>({
        id: 0,
        title: "",
        eventDate: "",
        eventType: "",
        description: "",
    });
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

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

    const handleDateClick = (arg: DateClickArg) => {
        if (!editable) return;
        setEventForm({id: 0, title: "", eventDate: arg.dateStr, eventType: "", description: "" });
        setSelectedEvent(null);
        setOpen(true);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        setEventForm({
            ...eventForm,
            title: clickInfo.event.title,
            eventDate: clickInfo.event.startStr,
            description: clickInfo.event.extendedProps.description || "",
            eventType: clickInfo.event.extendedProps.eventType || ""
        });
        // @ts-ignore
        setSelectedEvent(clickInfo.event);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEventForm({id: 0, title: "", eventDate: "", eventType: "", description: "" });
        setSelectedEvent(null);
    };

    const handleSaveEvent = () => {
        if (selectedEvent) {
            setEvents((prevEvents) =>
                prevEvents.map((evt) =>
                    evt === selectedEvent
                        ? {
                            ...evt,
                            title: eventForm.title,
                            start: eventForm.eventDate,
                            extendedProps: {
                                description: eventForm.description,
                                eventType: eventForm.eventType,
                            },
                        }
                        : evt
                )
            );
        } else {
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
        }
        handleClose();
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            setEvents((prevEvents) => prevEvents.filter((evt) => evt !== selectedEvent));
        }
        handleClose();
    };

    return (
        <div className="p-4">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={events}
                height="auto"
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedEvent ? "Event Details" : editable ? "Add New Event" : "Event Details"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Event Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        disabled={!editable}
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
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        disabled={!editable}
                    />
                    <TextField
                        margin="dense"
                        label="Event Type"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={eventForm.eventType}
                        onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
                        disabled={!editable}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    {editable && selectedEvent && <Button onClick={handleDeleteEvent} color="error">Delete</Button>}
                    {editable && <Button onClick={handleSaveEvent}>{selectedEvent ? "Save" : "Add"}</Button>}
                </DialogActions>
            </Dialog>
        </div>
    );
}


