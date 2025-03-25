import { Alert, Container, debounce, Grid2, TextField } from "@mui/material";
import { RegistrationDTO } from "@/app/register/registration_dto";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface BasicStepPageProps {
    signUpForm: RegistrationDTO;
    onDataChanged: (data: RegistrationDTO) => void;
}

export default function BasicStepPage({ signUpForm, onDataChanged }: BasicStepPageProps) {
    const [localData, setLocalData] = useState<RegistrationDTO | null>(null); // Initialize with null
    const [validationMessage, setValidationMessage] = useState("");
     const cancelTokenRef = useRef<axios.CancelTokenSource | null>(null);

    useEffect(() => {
        // Ensure data is set only after the component has mounted on the client
        setLocalData(signUpForm);
    }, [signUpForm]); 

    const debouncedVerifyEmail = debounce(async (value: string, updateLocalData: (isValid: boolean | null) => void) => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Operation canceled due to new request.");
        }
        cancelTokenRef.current = axios.CancelToken.source();

        try {
            const res = await axios.get(
                `https://localhost:7044/api/authenticate/verify?Field=Email&Value=${value}`,
                { cancelToken: cancelTokenRef.current.token }
            );
            console.log(res);
            updateLocalData(res.data.isValid); 
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
            } else {
                console.log(error);
            }
            updateLocalData(null); 
        }
    }, 1000);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, validationMessage } = e.target; // Use name attribute for key
        const { valid } = e.target.validity;
        setValidationMessage(validationMessage);
        if (localData) {
            localData.isEmailValid = false;

            let miniLocalData = localData;

            if(valid && value) {
                if (name == "email") {
                    debouncedVerifyEmail(value, (isValid) => {
                        setLocalData((prevData) => ({
                            ...prevData!,
                            isEmailValid: isValid ?? false,
                        }));
                        setValidationMessage(
                            isValid ? "Email valid" : "Email has already been taken."
                        );
                    });
                }

            } else {
                miniLocalData.isEmailValid = false;
            }
            
            setLocalData((prevData) => ({
                ...miniLocalData!,
                [name]: value,
            }));
            console.log(localData);

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
                    <h1 style={{ textAlign: "center" }}>Balance Your Universe, One Day at a Time!</h1>
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
                            validationMessage && validationMessage != "Email valid" && (
                                <Alert severity="error" sx={{
                                    marginY: 1
                                }}>{validationMessage}</Alert>
                            )
                        } 
                        {
                            validationMessage == "Email valid" && (
                                <Alert severity="success" sx={{
                                    marginY: 1
                                }}>Email is valid</Alert>
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
