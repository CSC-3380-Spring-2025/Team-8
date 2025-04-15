"use client";

import Navbar from "@/app/_global_components/Navbar";
import { Box, Container, Tab, Tabs } from "@mui/material";
import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import FriendsStepper from "./components/FriendsStepper";
import { TaskActivityView, UserFriendsRes } from "./friendsType";
import GalaxyBoostStepper from "./components/GalaxyBoostStepper";
import FriendActivityStepper from "./components/FriendActivityStepper";
import {useQuery} from "@tanstack/react-query";
import {getAllFriends, getPendingFriends} from "@/app/friends/api";

interface TabPanelProps {
	children?: ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			hidden={value !== index}
			id={`friends-tabpanel-${index}`}
			aria-labelledby={`friends-tab-${index}`}
			{...other}
		>
			{value === index && <>{children}</>}
		</div>
	);
}

export default function Page() {
	const [value, setValue] = useState(0);
	const [canView, setCanView] = useState(true);

	const handleTabChange = (e: SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const dummyFriends: UserFriendsRes[] = [
		{
			id: "1a2b3c4d-0001",
			name: "NovaKnight",
			planet: "Mars",
			username: "nova_knight",
		},
		{
			id: "1a2b3c4d-0002",
			name: "StellarRay",
			planet: "Venus",
			username: "stellar_ray",
		},
		{
			id: "1a2b3c4d-0003",
			name: "CometChaser",
			planet: "Jupiter",
			username: "comet_chaser",
		},
	];

	const dummyGalaxyBoosts = [
		{
			sender_id: "1a2b3c4d-0001",
			reciever_id: "9z8y7x6w-0001",
			message: "Boosted your galaxy!",
			sent_at: new Date().toString(),
			sender_name: "NovaKnight",
		},
		{
			sender_id: "1a2b3c4d-0002",
			reciever_id: "9z8y7x6w-0002",
			message: "Your galaxy is shining!",
			sent_at: new Date().toString(),
			sender_name: "StellarRay",
		},
		{
			sender_id: "1a2b3c4d-0003",
			reciever_id: "9z8y7x6w-0003",
			message: "Your galaxy is shining!",
			sent_at: new Date().toString(),
			sender_name: "CometChaser",
		},
		{
			sender_id: "1a2b3c4d-0003",
			reciever_id: "9z8y7x6w-0004",
			message: "Your galaxy is shining!",
			sent_at: new Date().toString(),
			sender_name: "CometChaser",
		},
	];

	const taskActivityData: TaskActivityView[] = [
		{
			username: "astroLuna23",
			name: "Luna Vega",
			title: "Finished 'Physics Homework 3'",
			completedAt: "2025-04-07T15:32:00Z",
		},
		{
			username: "nebulaNova",
			name: "Nova Lin",
			title: "Completed 'Biology Lab Report'",
			completedAt: "2025-04-07T21:14:00Z",
		},
		{
			username: "cosmoChris",
			name: "Chris Orion",
			title: "Submitted 'CS Project Proposal'",
			completedAt: "2025-04-08T09:47:00Z",
		},
		{
			username: "starrySkylar",
			name: "Skylar Ray",
			title: "Checked off 'Read Ch. 4 of Psych'",
			completedAt: "2025-04-08T12:03:00Z",
		},
		{
			username: "rocketRiya",
			name: "Riya Sol",
			title: "Wrapped up 'Math Problem Set 6'",
			completedAt: "2025-04-08T17:58:00Z",
		},
	];

	const {data: allFriendsData, isLoading} = useQuery({
		queryKey: ["viewALlFriends"],
		queryFn: getAllFriends
	})

	const {data: pendingFriendsData, isLoading: isPendLoading} = useQuery({
		queryKey: ["viewALlFriends"],
		queryFn: getPendingFriends
	})

	useEffect(() => {
		if (window.localStorage.getItem("authToken")) {
			setCanView(true);
			return;
		}


	}, []);

	if (!canView) {
		return (
			<>
				<Navbar/>
				<h2>You are banned from viewing this page.</h2>
			</>
		)
	}

	if (!isLoading && !isPendLoading && canView) {
		return (
			<>
				<Navbar />
				<Container>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={value}
							onChange={handleTabChange}
							aria-label="Friends Navigation tab"
						>
							<Tab label="Friends" />
							<Tab label="Galaxy Boosts" />
							<Tab label="Friend Activity" />
						</Tabs>
						<TabPanel
							value={value}
							index={0}
						>
							<FriendsStepper
								friendsInformation={allFriendsData ? allFriendsData : []}
								recentGalaxyBoosts={dummyGalaxyBoosts}
								pendingFriends={pendingFriendsData ? pendingFriendsData : []}
							/>
						</TabPanel>
						<TabPanel
							value={value}
							index={1}
						>
							<GalaxyBoostStepper
								galaxyBoostsRes={dummyGalaxyBoosts}
							/>
						</TabPanel>
						<TabPanel
							value={value}
							index={2}
						>
							<FriendActivityStepper
								allRecentActivity={taskActivityData}
							/>
						</TabPanel>
					</Box>
				</Container>
			</>
		);
	}
}
