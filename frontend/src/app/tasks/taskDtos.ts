export type CalendarEventDto = {
    id: number;
    eventDate: string;
    title: string;
    description?: string;
    eventType: string;
}

export type TaskDto = {
    id: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    dueDate?: string;
    priority: number;
}