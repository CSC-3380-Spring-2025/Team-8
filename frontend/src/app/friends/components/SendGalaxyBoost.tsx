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
		reciever_username: "",
		message: "",
	});

	const fetchUsernames = async (query: string): Promise<UserFriendsRes[]> => {
		// api request
		await new Promise((res) => setTimeout(res, 500));

		const dummyFriends: UserFriendsRes[] = [
			{
				id: crypto.randomUUID(),
				name: "NovaKnight",
				planet: "Mars",
				username: "nova_knight",
			},
			{
				id: crypto.randomUUID(),
				name: "StellarRay",
				planet: "Venus",
				username: "stellar_ray",
			},
			{
				id: crypto.randomUUID(),
				name: "CometChaser",
				planet: "Jupiter",
				username: "comet_chaser",
			},
			{
				id: crypto.randomUUID(),
				name: "GalaxyDrifter",
				planet: "Neptune",
				username: "galaxy_drifter",
			},
			{
				id: crypto.randomUUID(),
				name: "RayNova",
				planet: "Earth",
				username: "ray_nova",
			},
		];

		return dummyFriends.filter((friend) =>
			friend.name.toLowerCase().includes(query.toLowerCase())
		);
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

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget);

		let userMessage = data.get("message")?.toString();

		if (!selectedUser?.username || !userMessage) return;

		let galaxyBoostPostData: GalaxyBoostPost = {
			reciever_username: selectedUser?.username,
			message: userMessage,
		};

		console.log(galaxyBoostPostData);
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
					getOptionLabel={(option) => option.name}
					filterOptions={(options, { inputValue }) =>
						options.filter((option) =>
							option.name
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
