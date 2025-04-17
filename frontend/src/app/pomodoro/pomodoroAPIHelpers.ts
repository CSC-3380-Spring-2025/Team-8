import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";
import axios from "axios";
import {PomodoroDTO, PomodoroDTOPost} from "@/app/pomodoro/pomodoroDTO";


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

export const createPomodoro = async (pomodoroDto: PomodoroDTOPost): Promise<PomodoroDTO> => {
    try {
        const res = await axios.post(`${BASE_API_URL}/PomodoroSession`, pomodoroDto, getAxiosConfig());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const  deletePomodoro = async (id: string): Promise<any> => {
    try {
        const res:any = await axios.delete(`${BASE_API_URL}?/pomodoroSession/${id}`, getAxiosConfig());
        console.log("The pomodoroSession was deleted successfully:",res.data);
        return res;
    }
    catch (error) {
        console.error
    }
}