import { TaskDto } from "@/app/tasks/taskDtos";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
	Checkbox,
	Chip,
	List,
	ListItem,
	ListItemText,
	Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {deleteTask, updateTask} from "@/app/tasks/api/taskAPIHelpers";

export default function RecentTasksView({ tasks }: { tasks: TaskDto[] }) {
	const [sortedTasks, setSortedTasks] = useState<TaskDto[]>([]);

	useEffect(() => {
		// this code sorts by the due date and gives us only 5 tasks
		const sorted = [...tasks]
			.sort((a, b) => {
				return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
			})
			.slice(0, 5);
		setSortedTasks(sorted);
	}, [tasks]);

	const handleToggleCompleted = async (taskId: number) => {
		// Find the task first from current state
		const taskToUpdate = sortedTasks.find((task) => task.id === taskId);

		if (!taskToUpdate) return;

		// Create the updated task with toggled completion status
		const updatedTask = {
			...taskToUpdate,
			isCompleted: !taskToUpdate.isCompleted
		};

		try {
			// Send the updated task to the server first
			const data = await updateTask(taskId, updatedTask);

			if (data) {
				// Only update the UI if the server update was successful
				setSortedTasks((prev) =>
					prev.map((task) =>
						task.id === taskId ? updatedTask : task
					)
				);
			} else {
				console.error("Failed to update task");
				alert("Issue updating task");
			}
		} catch (error) {
			console.error("Error updating task:", error);
			alert("Failed to update task");
		}
	};

	async function handleDelete(taskId: number) {
		try {
			await deleteTask(taskId);

			// Remove the task from the UI after successful deletion
			setSortedTasks((prev) =>
				prev.filter((task) => task.id !== taskId)
			);
			console.log("Deleting task");
		} catch (error) {
			console.error("Error deleting task:", error);
			alert("Failed to delete task");
		}
	}

	return (
		<>
			{sortedTasks.length > 0 && (
				<List>
					{sortedTasks.map((task) => (
						<ListItem key={task.id}>
							<ListItemText
								primary={
									<>
										{task.title} {CustomChip(task.priority)}
									</>
								}
								secondary={`Due at: ${dayjs(
									task.dueDate
								).format("MMM D, YYYY")}`}
							>
								${task.description}
							</ListItemText>
							<Checkbox
								checked={task.isCompleted}
								onChange={() => handleToggleCompleted(task.id)}
							/>
							<Tooltip title={"Delete task"}>
								<Delete onClick={() => handleDelete(task.id)}/>
							</Tooltip>
						</ListItem>
					))}
				</List>
			)}
		</>
	);
}

function CustomChip(priority: number) {
	if (priority == 3) {
		return (
			<Chip
				label={"High Priority"}
				color={"error"}
				size="small"
			/>
		);
	} else if (priority == 2) {
		return (
			<Chip
				label={"Mid Priority"}
				color={"warning"}
				size="small"
			/>
		);
	}
}
