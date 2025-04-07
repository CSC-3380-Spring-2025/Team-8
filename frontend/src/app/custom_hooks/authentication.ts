import { AxiosRequestConfig } from "axios";

export const getAxiosConfig = (): AxiosRequestConfig => {
    const token = localStorage.getItem("authToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};