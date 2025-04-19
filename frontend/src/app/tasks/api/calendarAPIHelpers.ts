// here is where all the async calls will go

import axios from "axios";
import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";
import {CalendarEventDto} from "@/app/tasks/taskDtos";

export const createCalendarEvent = async (calendarEventDto: CalendarEventDto): Promise<CalendarEventDto> => {
    try {
        const res = await axios.post(`${BASE_API_URL}/calendar`, calendarEventDto, getAxiosConfig());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Implement the Delete and GET all calendars method here.
 */

export const getCalendarEvents = async () => {
	try {
		const res = await axios.get(`${BASE_API_URL}/calendar`, getAxiosConfig());
		console.log("Calendar events fetched:", res.data);
		return res.data;
	} catch (err) {
		console.error("Error fetching calendar events:", err);
		throw err;
	}
};

export const deleteCalendarEvent = async (id: number) => {
	try {
		const res = await axios.delete(`${BASE_API_URL}/calendar/${id}`, getAxiosConfig());
		console.log(`Deleted calendar event ${id}`, res.data);
		return res;
	} catch (err) {
		console.error(`Error deleting event ${id}:`, err);
		throw err;
	}
};


