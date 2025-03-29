import { Grid2, List, ListItem, ListItemText } from "@mui/material";
import { RegistrationDTO } from "../registration_dto";

interface VerificationPageProps {
    signUpForm: RegistrationDTO;
}

export default function VerificationSignup({signUpForm} : VerificationPageProps ) {
    return (
        <Grid2 container>
            <Grid2 size={12}>
                <h1>Ready to hop in the verse...</h1>
                <h3>Verify that all your information looks correct.</h3>
            </Grid2>
            <Grid2 size={12}>
                <List>
                    <ListItem key={signUpForm.name}>
                        <ListItemText primary={"First Name"} secondary={signUpForm.name} />
                    </ListItem>
                    <ListItem key={signUpForm.email}>
                        <ListItemText primary={"Email"} secondary={signUpForm.email} />
                    </ListItem>
                    <ListItem key={signUpForm.username}>
                        <ListItemText primary={"Username"} secondary={signUpForm.username} />
                    </ListItem>
                </List>
                <h3>Looks good? Hit submit and hop into the verse!</h3>
            </Grid2>
        </Grid2>
    )
}