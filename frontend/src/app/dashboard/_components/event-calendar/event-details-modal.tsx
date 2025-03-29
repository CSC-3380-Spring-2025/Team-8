"use client"

import type {CalendarEvent} from "@/app/dashboard/event";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import { Button } from "@mui/material";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";

interface EventDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    event: CalendarEvent | null
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
    if (!event) return null

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <h4 className="text-sm font-medium">Date & Time</h4>
                        <p className="text-sm text-muted-foreground">
                            {event.date.format("MMMM D, YYYY")} at {event.date.format("h:mm A")}
                        </p>
                    </div>
                    {event.description && (
                        <div>
                            <h4 className="text-sm font-medium">Description</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}
                </div>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}

