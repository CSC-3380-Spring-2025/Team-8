// here is where all the async calls will go

import axios from "axios";
import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";
import {CalendarEventDto} from "@/app/tasks/taskDtos";

/**
 * Calling the Calendar API
 */
export const getAllCalendarEvents = async (): Promise<CalendarEventDto[]> => {
    try {
        const res = await axios.get(`${BASE_API_URL}/calendar`, getAxiosConfig())
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}