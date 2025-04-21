"use client";

import Navbar from "@/app/_global_components/Navbar";
import {Box, CircularProgress, Container, Tab, Tabs} from "@mui/material";
import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import FriendsStepper from "./components/FriendsStepper";
import {TaskActivityView, UserFriendsRes} from "./friendsType";
import GalaxyBoostStepper from "./components/GalaxyBoostStepper";
import FriendActivityStepper from "./components/FriendActivityStepper";
import {useQuery} from "@tanstack/react-query";
import {getAllFriends, getFriendsActivity, getPendingFriends} from "@/app/friends/friendAPIHelpers";
import {getGravityBoostData} from "@/app/tasks/api/gravityBoostAPIHelper";

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

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

    const {data: allFriendsData, isLoading} = useQuery({
        queryKey: ["viewAllFriends"],
        queryFn: getAllFriends,
    });

    const {data: pendingFriendsData, isLoading: isPendLoading} = useQuery({
        queryKey: ["viewPendingFriends"],
        queryFn: getPendingFriends,
    });

    const {data: recentActivityData, isLoading: isActivityLoading} = useQuery({
        queryKey: ["viewRecentActivity"],
        queryFn: getFriendsActivity
    });

    const {data: galaxyBoostData, isLoading: isGalaxyBoostLoading} = useQuery({
        queryKey: ["viewGalaxyBoost"],
        queryFn: getGravityBoostData,
    })
    /**
     * TODO: Ryan add your query to get all the galaxy boosts for your call
     * similar to the format above.
     */

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
        );
    }

    if (isLoading || isPendLoading || isActivityLoading || isGalaxyBoostLoading) {
        return (
            <>
                <Navbar/>
                <CircularProgress/>
            </>
        );
    }

    if (!isLoading && !isPendLoading  && !isActivityLoading && !isGalaxyBoostLoading && canView) {
        return (
            <>
                <Navbar/>
                <Container>
                    <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            aria-label="Friends Navigation tab"
                        >
                            <Tab label="Friends"/>
                            <Tab label="Galaxy Boosts"/>
                            <Tab label="Friend Activity"/>
                        </Tabs>
                        <TabPanel
                            value={value}
                            index={0}
                        >
                            <FriendsStepper
                                friendsInformation={
                                    allFriendsData ? allFriendsData : []
                                }
                                recentGalaxyBoosts={galaxyBoostData}
                                pendingFriends={
                                    pendingFriendsData ? pendingFriendsData : []
                                }
                            />
                        </TabPanel>
                        <TabPanel
                            value={value}
                            index={1}
                        >
                            <GalaxyBoostStepper
                                galaxyBoostsRes={galaxyBoostData}
                            />
                        </TabPanel>
                        <TabPanel
                            value={value}
                            index={2}
                        >
                            <FriendActivityStepper
                                allRecentActivity={recentActivityData ? recentActivityData : []}
                            />
                        </TabPanel>
                    </Box>
                </Container>
            </>
        );
    }
}
