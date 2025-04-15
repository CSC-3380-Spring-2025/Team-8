"use client"

import {useState} from "react"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {Calendar, ChevronLeft, ChevronRight, Plus} from "lucide-react";
import Button from "@mui/material/Button";
import {Card, CardContent, CardHeader} from "@mui/material";
import AddEventModal from "./add-event-modal"
import EventDetailsModal from "./event-details-modal"
import type {CalendarEvent} from "@/app/dashboard/_components/event";
import Typography from "@mui/material/Typography";

// Initialize dayjs plugins
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

function getDaysInMonth(start: dayjs.Dayjs, end: dayjs.Dayjs) {
    const days: dayjs.Dayjs[] = []
    let day = start

    while (day.isSameOrBefore(end, "day")) {
        days.push(day)
        day = day.add(1, "day")
    }

    return days
}

export default function CalendarComponent() {
    const [currentDate, setCurrentDate] = useState(dayjs())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const monthStart = currentDate.startOf("month")
    const monthEnd = currentDate.endOf("month")
    const daysInMonth = getDaysInMonth(monthStart, monthEnd)

    const nextMonth = () => setCurrentDate(currentDate.add(1, "month"))
    const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"))

    const handleAddEvent = (event: CalendarEvent) => {
        setEvents([...events, event])
        setIsAddModalOpen(false)
    }

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event)
        setIsDetailsModalOpen(true)
    }

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false)
        setSelectedEvent(null)
    }

    const getEventsForDay = (day: dayjs.Dayjs) => {
        return events.filter((event) => event.date.isSame(day, "day"))
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5"/>
                    <h2 className="text-xl font-semibold">{currentDate.format("MMMM YYYY")}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outlined" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button variant="outlined" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Event
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <Typography>Calendar</Typography>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-center font-medium">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="p-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mt-1">
                        {daysInMonth.map((day, i) => {
                            const dayEvents = getEventsForDay(day)
                            return (
                                <div
                                    key={i}
                                    className={`min-h-[100px] p-2 border rounded-md ${
                                        day.month() === currentDate.month() ? "bg-background" : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    <div className="text-right">{day.format("D")}</div>
                                    <div className="mt-1 space-y-1">
                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="text-xs p-1 bg-primary/10 rounded truncate cursor-pointer hover:bg-primary/20 transition-colors"
                                                title={`${event.title} - ${event.date.format("h:mm A")}`}
                                                onClick={() => handleEventClick(event)}
                                            >
                                                <span
                                                    className="font-semibold">{event.date.format("h:mm A")}</span> {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
                           onAddEvent={handleAddEvent}/>

            <EventDetailsModal isOpen={isDetailsModalOpen} onClose={closeDetailsModal} event={selectedEvent}/>
        </div>
    )
}

