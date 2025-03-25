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
    const [validationMessage, setValidationMessage] = useState("");
     const cancelTokenRef = useRef<CancelTokenSource | null>(null);

    useEffect(() => {
        // Ensure data is set only after the component has mounted on the client
        setLocalData(signUpForm);
    }, [signUpForm]); 

    const debouncedUsername = debounce(async (value: string, updateLocalData: (isValid: boolean | null) => void) => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Operation canceled due to new request.");
        }
        cancelTokenRef.current = axios.CancelToken.source();

        try {
            const res = await axios.get(
                `https://localhost:7044/api/authenticate/verify?Field=Username&Value=${value}`,
                { cancelToken: cancelTokenRef.current.token }
            );
            console.log(res.data.isValid);
            updateLocalData(res.data.isValid); 
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
            } else {
                console.log(error);
            }
            updateLocalData(null); 
        }
    }, 2000);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, validationMessage } = e.target; // Use name attribute for key
        
        setValidationMessage(validationMessage);
        if (localData) {
            let miniLocalData = localData;

            if(name == "username") {
                localData.isUsernameValid = false;
                if(value) {
                    debouncedUsername(value.toUpperCase(), (isValid) => {
                        setLocalData((prevData) => ({
                            ...prevData!,
                            isUsernameValid: isValid ?? false,
                        }));
                        setValidationMessage(
                            isValid ? "Username valid" : `The username "${value}" has been taken.`
                        );
                    });
                } 
            }
            
            
            setLocalData((prevData) => ({
                ...miniLocalData!,
                [name]: value,
            }));

            onDataChanged({ ...localData!, [name]: value.toUpperCase() });
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
                            {
                                validationMessage && validationMessage != "Username valid" && (
                                    <Alert severity="error" sx={{
                                        marginY: 1
                                    }}>{validationMessage}</Alert>
                                )
                            } 
                            {
                                validationMessage == "Username valid" && (
                                    <Alert severity="success" sx={{
                                        marginY: 1
                                    }}>Username is not taken</Alert>
                                )
                            }
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