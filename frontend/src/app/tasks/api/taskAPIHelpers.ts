// here is where all the async calls will go

import axios, {AxiosResponse} from "axios";
import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";
import {TaskDto} from "@/app/tasks/taskDtos";

export const getAllTasks = async (): Promise<TaskDto[]> => {
    try {
        const res = await axios.get(`${BASE_API_URL}/Task`, getAxiosConfig());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createTask = async (taskDto: TaskDto): Promise<TaskDto> => {
    try {
        const res = await axios.post(`${BASE_API_URL}/Task`, taskDto);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * TODO: Alanna -- Implement the other two methods for deleting and updating a task.
 */
export const deleteTask = async (taskId: number): Promise<AxiosResponse<any>> => {
    try {
        const res = await axios.delete(`${BASE_API_URL}/Task/${taskId}`, getAxiosConfig());
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
