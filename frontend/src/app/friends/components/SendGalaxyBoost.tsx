import { FormEvent, useEffect, useState } from "react";
import {
	GalaxyBoostPost,
	GalaxyBoostRes,
	UserFriendsRes,
} from "../friendsType";
import {
	Autocomplete,
	Box,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	Input,
	TextField,
	FormLabel,
	Button,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getSearchableUsernames } from "../friendAPIHelpers";
import {createGravityBoost} from "@/app/tasks/api/gravityBoostAPIHelper";

export default function SendGalaxyBoost() {
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
    State dealing with the adding of a component
    */
	const [galaxyBoostPost, setGalaxyBoost] = useState<GalaxyBoostPost>({
		receiver_id: "",
		message: "",
	});

	const fetchUsernames = async (query: string): Promise<UserFriendsRes[]> => {
		console.log("Fetching usernames with query:", query);
		const data = await getSearchableUsernames(query);

		if (!data) {
			return [];
		}

		return data;
	};

	useEffect(() => {
		console.log("Input value changed:", inputValue);
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
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [inputValue]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget);

		let userMessage = data.get("message")?.toString();

		if (!selectedUser?.username || !userMessage) return;

		let galaxyBoostPostData: GalaxyBoostPost = {
			receiver_id: selectedUser?.id,
			message: userMessage,
		};

		// Send the galaxy boost post data to the server
		await createGravityBoost(galaxyBoostPostData)
			.then((res) => {
				console.log("Galaxy Boost sent:", res);

				// Clear all the data
				if( res.status == 200 || res.status == 201 || res.boost_Id) {
					setInputValue("");
					setSelectedUser(null);

					setGalaxyBoost({
						receiver_id: "",
						message: "",
					});

					e.currentTarget.reset();
				}
			})
			.catch((err) => {
				console.error("Error sending Galaxy Boost:", err);
				alert("Error sending Galaxy Boost.")
			});
	};

	return (
		<Box
			component={"form"}
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
			onSubmit={handleSubmit}
		>
			<FormControl>
				<FormLabel htmlFor="reciever_username">Reciever</FormLabel>
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
							name="reciever_username"
							required
						/>
					)}
				></Autocomplete>
			</FormControl>
			<FormControl>
				<FormLabel htmlFor="message">Message</FormLabel>
				<TextField
					id="outlined-multiline-flexible"
					name="message"
					multiline
					maxRows={4}
					fullWidth
				/>
			</FormControl>
			<Button
				type="submit"
				variant="contained"
				sx={{
					marginTop: 3,
					color: "white",
					backgroundColor: "grey",
				}}
				style={{
					borderRadius: 5,
					backgroundImage:
						"linear-gradient(to right,rgb(39, 3rgb(185, 28, 28), #ffffff)",
					fontSize: "1rem",
				}}
			>
				Send Message
			</Button>
		</Box>
	);
}
