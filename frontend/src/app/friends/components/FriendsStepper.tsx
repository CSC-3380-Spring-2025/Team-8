import {
	Autocomplete,
	Avatar,
	Button,
	Card,
	CircularProgress,
	Grid2,
	List,
	ListItem,
	ListItemText,
	Snackbar,
	TextField,
	Tooltip,
} from "@mui/material";
import { GalaxyBoostRes, UserFriendsRes } from "../friendsType";
import {
	DoNotDisturb,
	PersonAdd,
	PersonRemove,
	RocketLaunch,
} from "@mui/icons-material";
import { SyntheticEvent, useEffect, useState } from "react";
import {
	acceptFriendRequest,
	addFriends,
	getSearchableUsernames,
	ignoreFriendRequest,
	removeFriend,
} from "../friendAPIHelpers";

export default function FriendsStepper({
	friendsInformation,
	recentGalaxyBoosts,
	pendingFriends,
}: {
	friendsInformation: UserFriendsRes[];
	recentGalaxyBoosts: GalaxyBoostRes[];
	pendingFriends: UserFriendsRes[];
}) {
	/**
	 * State props
	 */
	const [friends, setFriends] = useState<UserFriendsRes[]>([]);
	const [pending, setPending] = useState<UserFriendsRes[]>([]);

	/*
    Dealing with friends input fields and autocomplete
    */
	const [inputValue, setInputValue] = useState<string>("");
	const [selectedUser, setSelectedUser] = useState<UserFriendsRes | null>(
		null
	);
	const [options, setOptions] = useState<UserFriendsRes[]>([]);
	const [loading, setLoading] = useState(false);

	/*
    Dealing with the snackbar for alerting whether a friend was added or not
    */

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");

	const fetchUsernames = async (query: string): Promise<UserFriendsRes[]> => {
		console.log("Fetching usernames with query:", query);
		const data = await getSearchableUsernames(query);

		if (!data) {
			return [];
		}

		return data;
	};

	useEffect(() => {
		// this happens everytime a user everytime we try to queyr for a username to add a fiend
		if (inputValue === "") {
			setOptions([]);
			return;
		}

		const timeoutId = setTimeout(() => {
			setLoading(true);
			fetchUsernames(inputValue).then((res) => {
				setOptions(res);
				setLoading(false);
			});
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [inputValue]);

	useEffect(() => {
		// this happens when the component mounts and when the friends list changes
		setFriends(friendsInformation);
		setPending(pendingFriends);
	}, [friendsInformation, pendingFriends]);

	const handleRemoveFriend = (id: string) => {
		// Logic to remove friend goes here
		console.log(`Removing friend with id: ${id}`);

		removeFriend(id)
			.then((res) => {
				setSnackbarMessage("Removed said friend.");
				setOpenSnackbar(true);
				setFriends((prev) => prev.filter((f) => f.id !== id));
			})
			.catch((err) => {
				setSnackbarMessage("Issue removing friend.");
				setOpenSnackbar(true);
			});
	};

	const handleIgnoreFriendRequest = (id: string) => {
		// api logic to ignore friend request goes here
		ignoreFriendRequest(id)
			.then((res) => {
				setPending((prev) => prev.filter((p) => p.id !== id));
				setSnackbarMessage("Ignoring friend request...");
				setOpenSnackbar(true);
			})
			.catch((err) => {});
	};

	const handleAcceptFriendRequest = (id: string) => {
		// future API Logic to accept friend request goes here
		acceptFriendRequest(id)
			.then((res) => {
				if (res?.status == 200) {
					const acceptedFriend = pending.find((p) => p.id === id);
					if (acceptedFriend) {
						setFriends((prev) => [...prev, acceptedFriend]);
						setPending((prev) => prev.filter((p) => p.id !== id));
					}

					setSnackbarMessage("Accepted friend request");
					setOpenSnackbar(true);
				} else {
					setSnackbarMessage("Error accepting friend request");
					setOpenSnackbar(true);
				}
			})
			.catch((err) => {
				setSnackbarMessage(err.message);
				setOpenSnackbar(true);
			});
	};

	const handleAddFriend = () => {
		console.log(selectedUser);

		// call the query
		if (!selectedUser) {
			setSnackbarMessage("Select a user.");
			setOpenSnackbar(true);

			return;
		}

		addFriends(selectedUser?.id)
			.then((res) => {
				if (selectedUser) {
					setSnackbarMessage(
						`Added ${selectedUser.name} as a friend!`
					);
					setOpenSnackbar(true);
				}

				// this code clears the input field and selected user after adding a friend
				setSelectedUser(null);
				setInputValue("");

				// update the list
			})
			.catch((err) => {
				console.log(err);

				// Set snackbar
				setSnackbarMessage(
					"Error adding user. Make sure the user doesn't have the same name as you"
				);
				setOpenSnackbar(true);
			});
	};

	return (
		<div>
			<Grid2
				container
				spacing={2}
				sx={{ padding: 2, borderRadius: 2 }}
			>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Friends</h2>
					{friends.length === 0 && <p>No friends found</p>}
					<List>
						{friends.map((friend, index) => (
							<ListItem
								key={index}
								sx={{
									padding: 2,
									backgroundColor: "white",
									marginBottom: 1,
									borderRadius: 2,
								}}
							>
								<Avatar>
									{friend.avatarUrl
										? friend.avatarUrl
										: friend.name.substring(0, 2)}
								</Avatar>
								<ListItemText
									primary={friend.name}
									secondary={`Planet: ${friend.planet}`}
									sx={{ marginLeft: 2, color: "black" }}
								/>
								<Tooltip
									title="Remove Friend"
									onClick={() =>
										handleRemoveFriend(friend.id)
									}
									data-friend-id={`${friend.id}`}
								>
									<PersonRemove
										sx={{
											marginLeft: "auto",
											color: "black",
										}}
									/>
								</Tooltip>
							</ListItem>
						))}
					</List>
				</Grid2>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Galaxy Boosts</h2>
					{recentGalaxyBoosts.length === 0 && (
						<p>No recent galaxy boosts</p>
					)}
					<List>
						{recentGalaxyBoosts.map((boost, index) => (
							<ListItem
								key={index}
								sx={{
									padding: 2,
									backgroundColor: "white",
									marginBottom: 1,
									borderRadius: 2,
								}}
							>
								<Avatar>
									{boost.sender_name.substring(0, 2)}
								</Avatar>
								<ListItemText
									primary={boost.message}
									secondary={`Boost from ${boost.sender_name}`}
									sx={{ marginLeft: 2, color: "black" }}
								/>
								<RocketLaunch
									sx={{ marginLeft: "auto", color: "black" }}
								/>
							</ListItem>
						))}
					</List>
				</Grid2>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Add a New Friend</h2>
					<Autocomplete
						options={options}
						getOptionLabel={(option) => option.username}
						filterOptions={(options, { inputValue }) =>
							options.filter((option) =>
								option.username
									.toLowerCase()
									.includes(inputValue.toLowerCase())
							)
						}
						value={selectedUser}
						onChange={(event, newValue) => {
							setSelectedUser(newValue);
						}}
						inputValue={inputValue}
						onInputChange={(event, newInputValue) => {
							setInputValue(newInputValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Search username"
								variant="outlined"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{loading ? (
												<CircularProgress
													color="inherit"
													size={20}
												/>
											) : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
							/>
						)}
					></Autocomplete>
					<Button
						onClick={handleAddFriend}
						sx={{ marginTop: 1 }}
					>
						Add Friend
					</Button>
				</Grid2>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Pending Friends</h2>
					<List>
						{pending.map((friend, index) => (
							<ListItem
								key={index}
								sx={{
									padding: 2,
									backgroundColor: "white",
									marginBottom: 1,
									borderRadius: 2,
								}}
							>
								<Avatar>
									{friend.avatarUrl
										? friend.avatarUrl
										: friend.name.substring(0, 2)}
								</Avatar>
								<ListItemText
									primary={friend.name}
									secondary={`Planet: ${friend.planet}`}
									sx={{ marginLeft: 2, color: "black" }}
								/>
								<Tooltip
									title="Accept Friend Request"
									onClick={() =>
										handleAcceptFriendRequest(friend.id)
									}
									data-friend-id={`${friend.id}`}
								>
									<PersonAdd
										sx={{
											marginLeft: "auto",
											color: "black",
										}}
									/>
								</Tooltip>
								<Tooltip
									title="Decline Friend Request"
									onClick={() =>
										handleIgnoreFriendRequest(friend.id)
									}
									data-friend-id={`${friend.id}`}
								>
									<DoNotDisturb
										sx={{ marginLeft: 1, color: "black" }}
									/>
								</Tooltip>
							</ListItem>
						))}
					</List>
				</Grid2>
			</Grid2>
			<Snackbar
				open={openSnackbar}
				message={snackbarMessage}
				autoHideDuration={6000}
				onClose={() => setOpenSnackbar(false)}
			/>
		</div>
	);
}
