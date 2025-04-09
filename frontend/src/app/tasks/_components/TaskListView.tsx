import React, { useState } from "react";
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
} from "@mui/material";
import { TaskDto } from "../taskDtos";

export default function TaskListView({ tasks }: { tasks: TaskDto[] }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [statusFilter, setStatusFilter] = useState("");
	const [priorityFilter, setPriorityFilter] = useState("");
	const [dueDateFilter, setDueDateFilter] = useState("");

	const handleChangePage = (event, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const filteredTasks = tasks.filter((task) => {
		const matchesStatus =
			statusFilter === "" || task.isCompleted.toString() === statusFilter;
		const matchesPriority =
			priorityFilter === "" ||
			task.priority.toString() === priorityFilter;
		const matchesDueDate =
			dueDateFilter === "" || task.dueDate === dueDateFilter;
		return matchesStatus && matchesPriority && matchesDueDate;
	});

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
								<TableRow key={task.id}>
									<TableCell>
										<Checkbox
											checked={task.isCompleted}
											disabled
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
