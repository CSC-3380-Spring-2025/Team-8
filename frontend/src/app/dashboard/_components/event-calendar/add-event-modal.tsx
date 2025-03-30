"use client"

import type React from "react"
import { useState } from "react"
import dayjs from "dayjs";
import type { CalendarEvent } from "@/app/dashboard/event";
import {Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField} from "@mui/material";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface AddEventModalProps {
    isOpen: boolean
    onClose: () => void
    onAddEvent: (event: CalendarEvent) => void
}

export default function AddEventModal({ isOpen, onClose, onAddEvent }: AddEventModalProps) {
    const [title, setTitle] = useState("")
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"))
    const [time, setTime] = useState(dayjs().format("HH:mm"))
    const [description, setDescription] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) return

        // Combine date and time into a single dayjs object
        const dateTime = dayjs(`${date}T${time}`)

        const newEvent: CalendarEvent = {
            title,
            date: dateTime,
            description,
        }

        onAddEvent(newEvent)
        resetForm()
    }

    const resetForm = () => {
        setTitle("")
        setDate(dayjs().format("YYYY-MM-DD"))
        setTime(dayjs().format("HH:mm"))
        setDescription("")
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Typography component="h2">Event Title</Typography>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter event title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Typography component="h2">Date</Typography>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Typography component="h2">Time</Typography>
                        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Typography component="h2">Description (Optional)</Typography>
                        <TextField
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter event description"
                            rows={3}
                        />
                    </div>
                    <DialogActions>
                        <Button type="button" variant={"outlined"} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Event</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}

