import {ProfileRes} from "@/app/profile/profileTypes";
import {List, ListItem, ListItemText} from "@mui/material";

export default function AccountSettingsList( {profileInformation}: {profileInformation: ProfileRes}) {

    return (
        <List sx={{paddingX: 2, marginTop: 2}}>
            <ListItem>
                <ListItemText primary={profileInformation.name} secondary={"Profile Name"} />
            </ListItem>
            <ListItem>
                <ListItemText primary={profileInformation.username} secondary={"Username"} />
            </ListItem>
            <ListItem>
                <ListItemText primary={profileInformation.email} secondary={"Email"} />
            </ListItem>
            <ListItem>
                <ListItemText primary={profileInformation.planet} secondary={"Planet"} />
            </ListItem>

        </List>
    )

}