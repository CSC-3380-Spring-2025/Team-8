"use client";

import Navbar from "@/app/_global_components/Navbar";
import {Container, Grid2} from "@mui/material";
import CalendarComponent from "@/app/tasks/_components/CalendarComponent";
import {CalendarEventDto, TaskDto} from "@/app/tasks/taskDtos";
import RecentEventsView from "@/app/tasks/_components/RecentEventsView";
import RecentTasksView from "@/app/tasks/_components/RecentTasksView";

export default function Page() {

    const mockEvents: CalendarEventDto[] = [
        {
            eventDate: "2025-04-10",
            title: "Team Standup Meeting",
            description: "Daily team sync-up to discuss progress",
            eventType: "Meeting",
            id: 6
        },
        {
            eventDate: "2025-04-12",
            title: "Project Deadline",
            description: "Submit final project deliverables",
            eventType: "Deadline",
            id: 1
        },
        {
            eventDate: "2025-04-15",
            title: "Doctor Appointment",
            description: "Routine checkup at 10:00 AM",
            eventType: "Personal",
            id: 2
        },
        {
            eventDate: "2025-04-18",
            title: "Hackathon",
            description: "Join the 24-hour university hackathon",
            eventType: "Event",
            id: 3
        },
        {
            eventDate: "2025-04-22",
            title: "Earth Day Cleanup",
            description: "Volunteer for local park cleanup",
            eventType: "Volunteer",
            id: 4
        },
    ];

    const mockTasks: TaskDto[] = [
        {
            id: 1,
            title: "Finish frontend layout",
            description: "Finalize dashboard and responsive layout",
            isCompleted: false,
            dueDate: "2025-04-10",
            priority: 1,
        },
        {
            id: 2,
            title: "Write project report",
            description: "Include introduction, diagrams, and results",
            isCompleted: false,
            dueDate: "2025-04-12",
            priority: 2,
        },
        {
            id: 3,
            title: "Team meeting",
            description: "Discuss progress and assign new tasks",
            isCompleted: true,
            dueDate: "2025-04-08",
            priority: 3,
        },
        {
            id: 4,
            title: "Push code to GitHub",
            isCompleted: false,
            dueDate: "2025-04-09",
            priority: 2,
        },
        {
            id: 5,
            title: "Prepare presentation slides",
            description: "Create visuals and speaker notes",
            isCompleted: false,
            dueDate: "2025-04-11",
            priority: 1,
        },
        {
            id: 6,
            title: "Clean up codebase",
            description: "Remove unused files and refactor functions",
            isCompleted: true,
            dueDate: "2025-04-07",
            priority: 3,
        },
    ];

    return (
        <>
            <Navbar/>
            <Container>
                <Grid2 container sx={{paddingX: 2}}>
                    <Grid2 size={{xs: 12}}>
                        <h3>Calendar Events</h3>
                        <CalendarComponent initialEvents={mockEvents}/>
                    </Grid2>
                    <Grid2 size={{sm: 12, md: 6}}>
                        <h2>Recent Events</h2>
                        <RecentEventsView initialEvents={mockEvents}/>
                    </Grid2>
                    <Grid2 size={{sm: 12, md: 6}}>
                        <h2>Upcoming Tasks</h2>
                        <RecentTasksView tasks={mockTasks}/>
                    </Grid2>
                </Grid2>
            </Container>

        </>
    );
}