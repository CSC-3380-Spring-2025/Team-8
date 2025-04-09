"use client";

import Navbar from "@/app/_global_components/Navbar";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	Grid2,
	Slider,
	TextField,
} from "@mui/material";
import CalendarComponent from "@/app/tasks/_components/CalendarComponent";
import { CalendarEventDto, TaskDto } from "@/app/tasks/taskDtos";
import RecentEventsView from "@/app/tasks/_components/RecentEventsView";
import RecentTasksView from "@/app/tasks/_components/RecentTasksView";
import { AddTask } from "@mui/icons-material";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { s } from "framer-motion/client";

export default function Page() {
	const mockEvents: CalendarEventDto[] = [
		{
			eventDate: "2025-04-10",
			title: "Team Standup Meeting",
			description: "Daily team sync-up to discuss progress",
			eventType: "Meeting",
			id: 6,
		},
		{
			eventDate: "2025-04-12",
			title: "Project Deadline",
			description: "Submit final project deliverables",
			eventType: "Deadline",
			id: 1,
		},
		{
			eventDate: "2025-04-15",
			title: "Doctor Appointment",
			description: "Routine checkup at 10:00 AM",
			eventType: "Personal",
			id: 2,
		},
		{
			eventDate: "2025-04-18",
			title: "Hackathon",
			description: "Join the 24-hour university hackathon",
			eventType: "Event",
			id: 3,
		},
		{
			eventDate: "2025-04-22",
			title: "Earth Day Cleanup",
			description: "Volunteer for local park cleanup",
			eventType: "Volunteer",
			id: 4,
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

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<TaskDto>({
		id: 0,
		title: "",
		description: "",
		isCompleted: false,
		dueDate: "",
		priority: 1,
	});

	const [events, setEvents] = useState<CalendarEventDto[]>(mockEvents);
	const [tasks, setTasks] = useState<TaskDto[]>(mockTasks);

	/*
    Code pertaining to the modal dialog for adding a new task.
    */
	const handleSaveTask = () => {
		// Preparing to send this to the task
		console.log("Task saved:", selectedTask);

		// Add the task to the list of tasks (mocked here)
		mockTasks.push({
			...selectedTask,
			id: mockTasks.length + 1, // Assign a new ID
		});

		// Reset the selected task and close the modal
		setSelectedTask({
			id: 0,
			title: "",
			description: "",
			isCompleted: false,
			dueDate: "",
			priority: 0,
		});
		setModalOpen(false);
	};

	const handleClickOpen = () => {
		setModalOpen(true);
	};

	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<>
			<Navbar />
			<Container>
				<Grid2
					container
					sx={{ paddingX: 2 }}
				>
					<Grid2 size={{ xs: 12 }}>
						<h3>Calendar Events</h3>
						<CalendarComponent initialEvents={events} />
					</Grid2>
					<Grid2 size={{ sm: 12, md: 6 }}>
						<h2>Recent Events</h2>
						<RecentEventsView initialEvents={events} />
					</Grid2>
					<Grid2 size={{ sm: 12, md: 6 }}>
						<h2>Upcoming Tasks</h2>
						<RecentTasksView tasks={tasks} />
					</Grid2>
				</Grid2>
			</Container>
			<Fab
				color="primary"
				aria-label="add"
				sx={{ position: "fixed", bottom: 16, right: 16 }}
				onClick={handleClickOpen}
			>
				<AddTask />
			</Fab>
			<Dialog
				open={modalOpen}
				onClose={handleClose}
			>
				<DialogTitle>Add New Task</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Event Title"
						type="text"
						fullWidth
						variant="standard"
						value={selectedTask.title}
						onChange={(e) =>
							setSelectedTask({
								...selectedTask,
								title: e.target.value,
							})
						}
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="Date"
							value={
								selectedTask.dueDate
									? dayjs(selectedTask.dueDate)
									: null
							}
							onChange={(newValue) => {
								if (newValue) {
									setSelectedTask({
										...selectedTask,
										dueDate: newValue.toISOString(),
									});
								}
							}}
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
						value={selectedTask.description}
						onChange={(e) =>
							setSelectedTask({
								...selectedTask,
								description: e.target.value,
							})
						}
					/>
					<div style={{ padding: 20 }}>
						<Slider
							marks={[
								{ value: 0, label: "Low Priority" },
								{ value: 50, label: "Medium Priority" },
								{ value: 100, label: "High Priority" },
							]}
							defaultValue={0}
							step={50}
							max={100}
							aria-label="Priority"
							onChange={(e, newValue) => {
								// map that value from one to three
								let priority = 0;
								if (newValue === 100) priority = 1;
								else if (newValue === 50) priority = 2;
								else if (newValue === 0) priority = 3;

								setSelectedTask({
									...selectedTask,
									priority: priority,
								});
							}}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSaveTask}>Save</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
