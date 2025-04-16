import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";
import axios from "axios";
import {PomodoroDTO} from "@/app/pomodoro/pomodoroDTO";


export const getActivePomodoro = async (): Promise<PomodoroDTO[]> => {
    try {
        const res = await axios.get(`${BASE_API_URL}/PomodoroSession/active`,
            getAxiosConfig()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}