import React, {useEffect, useState} from "react";
import interactionPlugin from "@fullcalendar/interaction";
import {EventClickArg, EventInput} from "fullcalendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip,} from "@mui/material";
import {CalendarEventDto} from "@/app/tasks/taskDtos";
import {EditCalendar} from "@mui/icons-material";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {createCalendarEvent, deleteCalendarEvent} from "@/app/tasks/api/calendarAPIHelpers";
import {DateTimePicker} from "@mui/x-date-pickers";

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
                id: event.id,
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
            id: clickInfo.event.extendedProps.id,
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

    const handleSaveEvent = async () => {
        if (!isAddMode) return;

        try {
            console.log("Trying to save: ", eventForm);

            const data = await createCalendarEvent(eventForm);
            console.log(data);

            setEvents((prevEvents) => [
                ...prevEvents,
                {
                    title: data.title,
                    start: data.eventDate,
                    extendedProps: {
                        description: data.description,
                        eventType: data.eventType,
                        id: data.eventId,
                    },
                },
            ]);
            handleClose();
        } catch (error) {
            console.log(error);
            alert("Error saving the calendar event.");
        }
    };


    const handleDeleteEvent = async () => {
        console.log(selectedEvent);

        if (selectedEvent) {
            try {
                // @ts-ignore
                await deleteCalendarEvent(selectedEvent.extendedProps.id);

                setEvents((prevEvents) =>
                    prevEvents.filter((evt) => evt !== selectedEvent)
                );
            } catch (error) {
                console.error("Error deleting calendar event:", error);
                alert("Failed to delete the event.");
            }
        } else {
            alert("No event selected for deletion.");
        }

        handleClose();
    };

    return (
        <div className="p-4">
            <Tooltip
                title="Add Event"
                onClick={openAddEventModal}
                style={{cursor: "pointer"}}
            >
                <EditCalendar/>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Date"
                            value={
                                eventForm.eventDate
                                    ? dayjs(eventForm.eventDate)
                                    : null
                            }
                            onChange={(newValue) => {
                                if (newValue) {
                                    setEventForm({
                                        ...eventForm,
                                        eventDate: newValue.toISOString(),
                                    });
                                    console.log(newValue.toISOString());
                                }
                            }}
                            disabled={!isAddMode}
                            slotProps={{
                                textField: {
                                    margin: "dense",
                                    fullWidth: true,
                                    variant: "standard",
                                },
                            }}
                        />
                    </LocalizationProvider>

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
