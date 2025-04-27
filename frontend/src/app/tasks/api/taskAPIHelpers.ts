// here is where all the async calls will go

import axios, { AxiosResponse } from "axios";
import {
	BASE_API_URL,
	getAxiosConfig,
} from "@/app/custom_hooks/authentication";
import { TaskDto } from "@/app/tasks/taskDtos";
import dayjs from "dayjs";

export const getAllTasks = async (): Promise<TaskDto[]> => {
	try {
		const res = await axios.get(`${BASE_API_URL}/Task`, getAxiosConfig());
		return res.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const createTask = async (taskDto: TaskDto): Promise<TaskDto> => {
	try {
		if (taskDto.dueDate) {
			taskDto.dueDate = dayjs(taskDto.dueDate).format("YYYY-MM-DD");
		}

		const res = await axios.post(
			`${BASE_API_URL}/Task`,
			taskDto,
			getAxiosConfig()
		);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

/**
 * TODO: Alanna -- Implement the other two methods for deleting and updating a task.
 */
export const deleteTask = async (
	taskId: number
): Promise<AxiosResponse<any>> => {
	try {
		const res = await axios.delete(
			`${BASE_API_URL}/Task/${taskId}`,
			getAxiosConfig()
		);
		return res;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
// Updating a task
export const updateTask = async (
	taskId: number,
	taskDto: TaskDto
): Promise<TaskDto> => {
	try {
		if (taskDto.dueDate) {
			taskDto.dueDate = dayjs(taskDto.dueDate).format("YYYY-MM-DD");
		} else {
			// @ts-ignore
			taskDto.dueDate = null;
		}

		const res = await axios.put(
			`${BASE_API_URL}/Task/${taskId}`,
			taskDto,
			getAxiosConfig()
		);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
