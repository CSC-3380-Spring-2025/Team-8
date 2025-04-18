import axios, {AxiosError, AxiosResponse} from "axios";
import {TaskActivityView, UserFriendsRes} from "./friendsType";
import { BASE_API_URL, getAxiosConfig } from "../custom_hooks/authentication";
import {async} from "rxjs";

export const getSearchableUsernames = async (
	username: string
): Promise<UserFriendsRes[]> => {
	const response = await axios.get(
		`${BASE_API_URL}/authenticate/search?username=${username}`
	);

	return response.data;
};

export const getAllFriends = async (): Promise<UserFriendsRes[]> => {
	try {
		const res = await axios.get(
			`${BASE_API_URL}/Friends/list`,
			getAxiosConfig()
		)
		console.log(res)
		return res.data;
	} catch (error: unknown) {
		console.log(error);
		throw error;
	}
}

export const getPendingFriends = async (): Promise<UserFriendsRes[]> => {
	try {
		const res = await axios.get(`${BASE_API_URL}/Friends/pending`, getAxiosConfig());
		console.log("Pending friends");
		console.log(res);
		return res.data;
	} catch (error: unknown) {
		console.log(error);
		throw error;
	}
}

export const addFriends = async (recipientId: string): Promise<AxiosResponse> => {
	try {
		const res = await axios.post(`${BASE_API_URL}/Friends/request?recipientId=${recipientId}`,
			{},
			getAxiosConfig()
		)

		return res;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export const removeFriend = async (id: string) => {
	try {
		const res = await axios.delete(`${BASE_API_URL}/Friends/remove/${id}`, getAxiosConfig());
		console.log("Friend removed:", res.data);

		return res;
	} catch (err) {
		console.error("Error removing friend:", err);
	}
};

export const ignoreFriendRequest = async (id: string) => {
	try {
		const res = await axios.post(`${BASE_API_URL}/Friends/ignore?recipientID=${id}`, {}, getAxiosConfig());
		console.log("Friend request ignored:", res.data);

		return res;
	} catch (err) {
		console.error("Error ignoring friend request:", err);
	}
};

export const acceptFriendRequest = async (id: string) => {
	try {
		const res = await axios.post(`${BASE_API_URL}/Friends/accept?recipientId=${id}`, {}, getAxiosConfig());
		console.log("Friend request accepted:", res.data);

		return res;
	} catch (err) {
		console.error("Error accepting friend request:", err);
	}
};

export const getFriendsActivity = async (): Promise<TaskActivityView[]> => {
	try {
		const res = await axios.get(`${BASE_API_URL}/Friends/activity`, getAxiosConfig());
		return res.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
}