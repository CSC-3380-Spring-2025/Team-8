import React, { SyntheticEvent, useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Checkbox,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Box,
	Typography,
	Button,
} from "@mui/material";
import { TaskDto } from "../taskDtos";

export default function TaskListView({ tasks }: { tasks: TaskDto[] }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [statusFilter, setStatusFilter] = useState("");
	const [priorityFilter, setPriorityFilter] = useState("");
	const [dueDateFilter, setDueDateFilter] = useState("");
	const [taskList, setTaskList] = useState<TaskDto[]>(tasks);

	useEffect(() => {
		setTaskList(tasks);
		console.log(tasks);
	}, [tasks]);

	useEffect(() => {
		console.log("Updated taskList:", taskList);
	}, [taskList]);

	const handleChangePage = (event, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const resetFilters = () => {
		setStatusFilter("");
		setPriorityFilter("");
		setDueDateFilter("");
		setPage(0);
	};

	const filteredTasks = taskList.filter((task) => {
		const matchesStatus =
			statusFilter === "" || task.isCompleted.toString() === statusFilter;
		const matchesPriority =
			priorityFilter === "" ||
			task.priority.toString() === priorityFilter;
		const matchesDueDate =
			dueDateFilter === "" || task.dueDate === dueDateFilter;
		return matchesStatus && matchesPriority && matchesDueDate;
	});

	const handleTaskChange = (taskId: number) => {
		// Filter for the task with the given ID
		const updatedTask = taskList.find((task) => task.id === taskId);

		// TODO: this will be where the API call to update the task will be made before updating the local copy

		const updatedTasks = taskList.map((task) => {
			if (task.id === taskId) {
				return { ...task, isCompleted: !task.isCompleted };
			}
			return task;
		});
		setTaskList(updatedTasks);
	};

	const handleDeleteTask = (taskId: number) => {
		// Filter for the task with the given ID
		const deletedTask = taskList.find((task) => task.id === taskId);

		// TODO: this will be where the API call to delete the task will be made before updating the local copy

		// Filter out the task with the given ID
		const updatedTasks = taskList.filter((task) => task.id !== taskId);
		setTaskList(updatedTasks);
	};

	return (
		<Box
			p={2}
			sx={{ width: "100%", overflow: "hidden" }}
		>
			<Typography
				variant="h5"
				mb={2}
			>
				Task List
			</Typography>

			<Box
				display="flex"
				gap={2}
				mb={2}
			>
				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel>Status</InputLabel>
					<Select
						value={statusFilter}
						label="Status"
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<MenuItem value="">All</MenuItem>
						<MenuItem value="true">Completed</MenuItem>
						<MenuItem value="false">Incomplete</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel>Priority</InputLabel>
					<Select
						value={priorityFilter}
						label="Priority"
						onChange={(e) => setPriorityFilter(e.target.value)}
					>
						<MenuItem value="">All</MenuItem>
						<MenuItem value="1">High</MenuItem>
						<MenuItem value="2">Medium</MenuItem>
						<MenuItem value="3">Low</MenuItem>
					</Select>
				</FormControl>

				<TextField
					label="Due Date"
					type="date"
					value={dueDateFilter}
					onChange={(e) => setDueDateFilter(e.target.value)}
					InputLabelProps={{ shrink: true }}
				/>

				<Button
					variant="outlined"
					color="secondary"
					onClick={resetFilters}
					sx={{ alignSelf: "center" }}
				>
					Reset Filters
				</Button>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Completed</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Due Date</TableCell>
							<TableCell>Priority</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredTasks
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((task) => (
								<TableRow
									key={task.id}
									data-id={task.id}
								>
									<TableCell>
										<Checkbox
											checked={task.isCompleted}
											onChange={() =>
												handleTaskChange(task.id)
											}
										/>
									</TableCell>
									<TableCell>{task.title}</TableCell>
									<TableCell>
										{task.description || "-"}
									</TableCell>
									<TableCell>{task.dueDate}</TableCell>
									<TableCell>
										{
											["High", "Medium", "Low"][
												task.priority - 1
											]
										}
									</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="error"
											size="small"
											onClick={() =>
												handleDeleteTask(task.id)
											}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				<TablePagination
					component="div"
					count={filteredTasks.length}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					rowsPerPageOptions={[5, 10, 25]}
				/>
			</TableContainer>
		</Box>
	);
}
