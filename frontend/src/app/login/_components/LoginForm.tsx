import { Alert, Box, Button, Card, Divider, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false); 
    const [responseError, setResponseError] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        /**
         * Responsible for sending the login form to the server.
         */
        e.preventDefault();
        if(emailError || passwordError)  {
            return;
        }

        const data = new FormData(e.currentTarget);

        let authRequest = {
            email: data.get("email"),
            password: data.get("password")
        };

        // Validate and send to the backend
        await axios.post("https://localhost:7044/api/authenticate/login", authRequest, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            let data = res.data;

            localStorage.setItem("authToken", data.token);
            // Navigate to the personal dashboard page
            router.push("/friends");
        }).catch(error => {
            console.log(error);

            let data = error.response.data;
            try {
                let errors = data.error;
                setResponseError(errors);
            } catch {
                setResponseError("Error occured when trying to log user in. Try again later.");
            }

            return;
        })
    }

    return (
        <Card sx={{
            paddingX: 4,
            gap: 2,
            alignSelf: "center"
        }}>
            <h1>Sign in</h1>
            <Box component={"form"} sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
                onSubmit={handleSubmit}
            >
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        error={passwordError}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                    />
                </FormControl>
                <Button 
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        marginTop: 3,
                    }} 
                    style={{
                        borderRadius: 34,
                        backgroundImage: "linear-gradient(to right,rgb(39, 3rgb(185, 28, 28), #ffffff)",
                        fontSize: "1rem"
                    }}
                >
                    Sign In
                </Button>
                {
                    responseError && (
                        <Alert severity="error" sx={{marginY: 2}}>{responseError}</Alert>
                    )
                }
            </Box>
            <Divider>or</Divider>
            <Button fullWidth variant="contained" sx={{
                marginY: 3
            }}>
                Create An Account!
            </Button>
        </Card>
    );
}