import { Alert, Box, Container, debounce, Grid2, TextField } from "@mui/material";
import { RegistrationDTO } from "@/app/register/registration_dto";
import { useEffect, useState, useRef } from "react";
import axios, { CancelTokenSource } from "axios";

interface BasicStepPageProps {
    signUpForm: RegistrationDTO;
    onDataChanged: (data: RegistrationDTO) => void;
}

export default function Step2Registration({ signUpForm, onDataChanged }: BasicStepPageProps) {
    const [localData, setLocalData] = useState<RegistrationDTO | null>(null); // Initialize with null

    useEffect(() => {
        // Ensure data is set only after the component has mounted on the client
        setLocalData(signUpForm);
    }, [signUpForm]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (localData ) {
            let miniLocalData = localData;

            if(name == "username" && !value) {
                miniLocalData.isUsernameValid = false;
            } else if (name  == "username" && value) {
                miniLocalData.isUsernameValid = true;
            }

            console.log(miniLocalData);
            onDataChanged({ ...localData!, [name]: value });
            console.log(localData);
        }
    };

    if (!localData) {
        // Prevent rendering until localData is available
        return <div>Loading...</div>; 
    }

    return (
        <>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                    <h1 style={{ textAlign: "center" }}>Balance Your Universe, One Day at a Time!</h1>
                    <h3 style={{ textAlign: "center" }}>Continue your journey here...</h3>
                    <div className={"step1-field"}>
                        <Box component="form">
                            <TextField
                                id="name"
                                className="signup-fields"
                                label="Name"
                                fullWidth
                                name="name" // Add name attribute to match the state property
                                onChange={handleChange}
                                value={localData.name}
                                required
                                helperText="Enter your first name."
                            />
                            <TextField
                                id="username"
                                className="signup-fields"
                                label="Username"
                                fullWidth
                                name="username" // Add name attribute to match the state property
                                onChange={handleChange}
                                value={localData.username}
                                required
                                helperText="Enter a username"
                            />
                        </Box>
                    </div>
                </Grid2>
                <Grid2 size={{ xs: 0, md: 8 }}>
                    <Container sx={{ paddingTop: 3 }}>
                        <video
                            autoPlay={true}
                            loop={true}
                            muted={true}
                            controls={false}
                            style={{
                                animation: "fadeIn 0.5s ease-out",
                                width: "100%",
                                borderRadius: 15,
                            }}
                        >
                            <source
                                src={
                                    "https://studyversestuff.s3.us-east-2.amazonaws.com/183279-870457579_small.mp4"
                                }
                                type={"video/mp4"}
                            />
                        </video>
                    </Container>
                </Grid2>
            </Grid2>
        </>
    );
}