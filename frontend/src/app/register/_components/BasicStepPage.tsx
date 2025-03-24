import { Alert, Container, Grid2, TextField } from "@mui/material";
import { RegistrationDTO } from "@/app/register/registration_dto";
import { useEffect, useState } from "react";
import axios from "axios";
import { error } from "console";

interface BasicStepPageProps {
    signUpForm: RegistrationDTO;
    onDataChanged: (data: RegistrationDTO) => void;
}

export default function BasicStepPage({ signUpForm, onDataChanged }: BasicStepPageProps) {
    const [localData, setLocalData] = useState<RegistrationDTO | null>(null); // Initialize with null
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        // Ensure data is set only after the component has mounted on the client
        setLocalData(signUpForm);
    }, [signUpForm]); 

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, validationMessage } = e.target; // Use name attribute for key
        const { valid } = e.target.validity;
        setValidationMessage(validationMessage);
        if (localData) {
            let miniLocalData = localData;

            if(valid && value) {
                // Peform remote fetching to verify the email
                miniLocalData.isEmailValid = true;
                if (name == "email") {
                    axios.get(`https://localhost:7044/api/authenticate/verify?Field=Email&Value=${value}`)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }

            } else {
                miniLocalData.isEmailValid = false;
            }
            
            console.log(miniLocalData);
            setLocalData((prevData) => ({
                ...miniLocalData!,
                [name]: value,
            }));
            onDataChanged({ ...localData!, [name]: value });
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
                    <h1 style={{ textAlign: "center" }}>Defeat the Black Hole of Deadlines!</h1>
                    <h3 style={{ textAlign: "center" }}>Sign up now!</h3>
                    <div className={"step1-field"}>
                        <TextField
                            id="email"
                            className="signup-fields"
                            label="Email"
                            type="email"
                            fullWidth
                            name="email" // Add name attribute to match the state property
                            onChange={handleChange}
                            value={localData.email}
                            required
                        />
                        {
                            validationMessage && (
                                <Alert severity="error" sx={{
                                    marginY: 1
                                }}>{validationMessage}</Alert>
                            )
                        }
                        <TextField
                            id="password"
                            className="signup-fields"
                            label="Password"
                            type="password"
                            fullWidth
                            name="password" // Add name attribute to match the state property
                            value={localData.password}
                            onChange={handleChange}
                            required
                        />
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
