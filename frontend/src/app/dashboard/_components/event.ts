import type { Dayjs } from "dayjs";

export interface CalendarEvent {
    id?: number;
    title: string
    date: Dayjs
    description: string
}

