"use client";

import Navbar from "@/app/_global_components/Navbar";
import {Card, CircularProgress, Container, List, ListItem, ListItemText} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {deleteProfile, getCurrentProfile} from "@/app/profile/profileAPIhelpers";
import AccountSettingsList from "@/app/profile/_components/AccountSettingsList";
import Button from "@mui/material/Button";
import {useRouter} from "next/navigation";

export default function Page() {

    const {data, isLoading} = useQuery({
        queryKey: ["loadProfile"],
        queryFn: getCurrentProfile
    })

    const router = useRouter();

    if (isLoading) {
        return (
            <>
                <Navbar/>
                <Container>
                    <CircularProgress sx={{alignItems: "center", justifyContent: "center"}}/>
                </Container>
            </>
        );
    }

    const handleDeleteAccount = async () => {
        const res = await deleteProfile();
        if (res.status === 200 || res.status === 201) {
            router.push("/login");
        } else {
            console.error("Failed to delete account");

            alert("Failed to delete account. Try again later.");
        }
    }

    return (
        <>
            <Navbar/>
            <Container>
                <h1>Profile</h1>
                <Card variant="outlined" sx={{paddingX: 2, marginTop: 2}}>
                    <h1>Account Information</h1>
                    {data && (<AccountSettingsList profileInformation={data}/>)}
                </Card>

                <Card variant="outlined" sx={{paddingX: 2, marginTop: 2}}>
                    <h2>Danger Zone</h2>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={"Delete Account"}
                                secondary={"This action is irreversible. Please proceed with caution."}
                            />
                            <Button color={"error"} aria-label={"Delete Account"} onClick={handleDeleteAccount}>Delete Account</Button>
                        </ListItem>
                    </List>
                </Card>
            </Container>
        </>
    );
}