import { Avatar, List, ListItem, ListItemText } from "@mui/material";
import { UserFriendsRes } from "../friendsType";

export default function FriendsStepper({friendsInformation}: { friendsInformation: UserFriendsRes[] }) {
    return (
        <div>
            <List>
                {friendsInformation.map((friend, index) => (
                    <ListItem key={index} data-testid={`${friend.id}`} sx={{ padding: 2, backgroundColor: 'white', marginBottom: 1, borderRadius: 2 }}>
                        <Avatar>{friend.name.substring(0,2)}</Avatar>
                        <ListItemText 
                            primary={friend.name}
                            secondary={`Planet: ${friend.planet}`}
                            sx={{ marginLeft: 2, color: 'black' }} 
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}