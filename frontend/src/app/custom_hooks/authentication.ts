import { AxiosRequestConfig } from "axios";

export const BASE_API_URL = "https://localhost:7044/api";

export const getAxiosConfig = (): AxiosRequestConfig => {
	const token = localStorage.getItem("authToken");
	return {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};
};
