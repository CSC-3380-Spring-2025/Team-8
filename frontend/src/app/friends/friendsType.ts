export type UserFriendsRes = {
	id: string;
	name: string;
	username: string;
	planet: string;
	avatarUrl?: string;
};

export type GalaxyBoostRes = {
	sender_id: string;
	sender_name: string;
	reciever_id: string;
	message: string;
	sent_at: string;
};

/*
Type dealing what it looks like to send a post request to the server
*/
export type GalaxyBoostPost = {
	reciever_username: string;
	message: string;
};

/*
 * This API link really should return all the tasks from a users friend list, that are completed
 */
export type TaskActivityView = {
	username: string;
	name: string;
	title: string;
	completedAt: string; // should really return a timestamp that can be parsed
};
