"use client";

import Navbar from "@/app/_global_components/Navbar";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { ReactNode, SyntheticEvent, useState } from "react";
import FriendsStepper from "./components/FriendsStepper";
import { UserFriendsRes } from "./friendsType";

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

    const handleTabChange = (e: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    const dummyFriends: UserFriendsRes[] = [
        { id: '1a2b3c4d-0001', name: 'NovaKnight', planet: 'Mars', username: 'nova_knight' },
        { id: '1a2b3c4d-0002', name: 'StellarRay', planet: 'Venus', username: 'stellar_ray' },
        { id: '1a2b3c4d-0003', name: 'CometChaser', planet: 'Jupiter', username: 'comet_chaser' },
    ];


    const dummyGalaxyBoosts = [
        {
            sender_id: '1a2b3c4d-0001',
            reciever_id: '9z8y7x6w-0001',
            message: 'Boosted your galaxy!',
            sent_at: new Date().toString(),
            sender_name: 'NovaKnight',
        },
        {
            sender_id: '1a2b3c4d-0002',
            reciever_id: '9z8y7x6w-0002',
            message: 'Your galaxy is shining!',
            sent_at: new Date().toString(),
            sender_name: 'StellarRay',
        },
        {
            sender_id: '1a2b3c4d-0003',
            reciever_id: '9z8y7x6w-0003',
            message: 'Your galaxy is shining!',
            sent_at: new Date().toString(),
            sender_name: 'CometChaser',
        },
        {
            sender_id: '1a2b3c4d-0003',
            reciever_id: '9z8y7x6w-0004',
            message: 'Your galaxy is shining!',
            sent_at: new Date().toString(),
            sender_name: 'CometChaser',
        },
    ];

    return (
        <>
            <Navbar/>
            <Container>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleTabChange} aria-label="Friends Navigation tab">
                        <Tab label="Friends"/>
                        <Tab label="Galaxy Boosts"/>
                        <Tab label="Friend Activity"/>
                    </Tabs>
                        <TabPanel value={value} index={0}>
                            <FriendsStepper friendsInformation={dummyFriends} recentGalaxyBoosts={dummyGalaxyBoosts} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <h1>Free Real</h1>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <h3>YEs</h3>
                        </TabPanel>
                </Box>
            </Container>
            
        </>
    );
}