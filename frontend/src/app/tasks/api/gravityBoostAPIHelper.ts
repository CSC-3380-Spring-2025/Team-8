import axios from 'axios';
import {BASE_API_URL, getAxiosConfig} from "@/app/custom_hooks/authentication";
import {GalaxyBoostPost} from "@/app/friends/friendsType";

export const getGravityBoostData = async () => {
	try {
		const res = await axios.get(`${BASE_API_URL}/GravityBoost`, getAxiosConfig());
		console.log("Fetched GravityBoost data:", res.data);
		return res.data;
	} catch (err) {
		console.error("Error fetching GravityBoost data:", err);
	}
};

export const createGravityBoost = async (payload: GalaxyBoostPost) => {
	try {
		const res = await axios.post(`${BASE_API_URL}/GravityBoost`, payload, getAxiosConfig());
		console.log("Created GravityBoost:", res.data);
		return res.data;
	} catch (err) {
		console.error("Error creating GravityBoost:", err);
	}
};

export const updateGravityBoost = async (id: number, payload: any) => {
	try {
		const res = await axios.put(`${BASE_API_URL}/GravityBoost/${id}`, payload, getAxiosConfig());
		console.log("Updated GravityBoost:", res.data);
		return res.data;
	} catch (err) {
		console.error("Error updating GravityBoost:", err);
	}
};
