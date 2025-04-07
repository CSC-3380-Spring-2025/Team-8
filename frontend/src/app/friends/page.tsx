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
        { id: crypto.randomUUID(), name: 'NovaKnight', planet: 'Mars' },
        { id: crypto.randomUUID(), name: 'StellarRay', planet: 'Venus' },
        { id: crypto.randomUUID(), name: 'CometChaser', planet: 'Jupiter' },
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
                            <FriendsStepper friendsInformation={dummyFriends} />
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