"use client";

import Navbar from "@/app/_global_components/Navbar";
import {
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
import {CalendarEventDto, TaskDto} from "@/app/tasks/taskDtos";
import RecentEventsView from "@/app/tasks/_components/RecentEventsView";
import RecentTasksView from "@/app/tasks/_components/RecentTasksView";
import {AddTask} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TaskListView from "./_components/TaskListView";
import {createTask, getAllTasks} from "@/app/tasks/api/taskAPIHelpers";

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
	const [tasks, setTasks] = useState<TaskDto[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getAllTasks();
				setTasks(data);

				/**
				 * TODO: Marcus add your await call for getting all the calendar events here
				 * then call the state function (aka: setEvents) with the new data,
				 */
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};
		fetchData();
	}, []);


	/*
    Code pertaining to the modal dialog for adding a new task.
    */
	const handleSaveTask = async () => {
		try {
			// Log the task being saved
			console.log("Task saved:", selectedTask);

			// ACTION THAT SENDS THE TASK TO THE BACKEND.
			const data = await createTask(selectedTask);

			// reset the tasks
			setTasks([...tasks, data]);
			setSelectedTask({
				id: 0,
				title: "",
				description: "",
				isCompleted: false,
				dueDate: "",
				priority: 0,
			});
			setModalOpen(false);
		} catch (error) {
			// Handle any errors during the API call
			console.error("Error saving task:", error);
		}
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
					<Grid2 size={{ sm: 12 }}>
						<h2>Recent Tasks</h2>
						<TaskListView tasks={tasks} />
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
