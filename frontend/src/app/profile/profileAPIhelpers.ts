import {ProfileRes} from "@/app/profile/profileTypes";
import axios from "axios";
import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";

export const getCurrentProfile = async (): Promise<ProfileRes> => {
    try {
        const res = await axios.get(`${BASE_API_URL}/authenticate/profile`, getAxiosConfig());
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteProfile = async (): Promise<void> => {
    try {
        return await axios.delete(`${BASE_API_URL}/authenticate/delete-account`, getAxiosConfig());
    } catch (error) {
        console.log(error);
        throw error;
    }
}