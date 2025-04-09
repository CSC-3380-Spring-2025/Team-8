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

export default function RecentTasksView({ tasks }: { tasks: TaskDto[] }) {
	const [sortedTasks, setSortedTasks] = useState<TaskDto[]>([]);

	useEffect(() => {
		const sorted = [...tasks]
			.sort((a, b) => {
				return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
			})
			.slice(0, 5);
		setSortedTasks(sorted);
	}, [tasks]);

	const handleToggleCompleted = (taskId: number) => {
		setSortedTasks((prev) =>
			prev.map((task) =>
				task.id === taskId
					? { ...task, isCompleted: !task.isCompleted }
					: task
			)
		);
		console.log(sortedTasks.filter((task) => task.id === taskId));
	};

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
								<Delete />
							</Tooltip>
						</ListItem>
					))}
				</List>
			)}
		</>
	);
}

function CustomChip(priority: number) {
	if (priority == 1) {
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
