import axios from "axios";
import { UserFriendsRes } from "./friendsType";
import { BASE_API_URL, getAxiosConfig } from "../custom_hooks/authentication";

export const getSearchableUsernames = async (
	username: string
): Promise<UserFriendsRes[]> => {
	const response = await axios.get(
		`${BASE_API_URL}/authenticate/search?username=${username}`
	);

	return response.data;
};

/**
 * API Request response for sending a friend request
 */
export const sendFriendRequest = async (recipient_id: string): Promise<any> => {
	try {
		const response = await axios.post(
			`${BASE_API_URL}/Friends/request?recipientId=${recipient_id}`,
			{},
			getAxiosConfig()
		);
		return response.data;
	} catch (error) {
		console.error("Error sending friend request:", error);
		throw error; // rethrow if you want caller to handle it
	}
};
