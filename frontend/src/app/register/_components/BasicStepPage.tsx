import {Alert, Container, Grid2, TextField} from "@mui/material";
import {RegistrationDTO} from "@/app/register/registration_dto";
import {useEffect, useState} from "react";

interface BasicStepPageProps {
    signUpForm: RegistrationDTO;
    onDataChanged: (data: RegistrationDTO) => void;
}

export default function BasicStepPage({signUpForm, onDataChanged}: BasicStepPageProps) {
    const [localData, setLocalData] = useState<RegistrationDTO | null>(null); // Initialize with null
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        // Ensure data is set only after the component has mounted on the client
        setLocalData(signUpForm);
    }, [signUpForm]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, validationMessage} = e.target; // Use name attribute for key
        const {valid} = e.target.validity;
        setValidationMessage(validationMessage);
        if (localData) {
            let miniLocalData = localData;

            if (name == "email") {
                if (valid && value) {
                    miniLocalData.isEmailValid = true;
                } else {
                    miniLocalData.isEmailValid = false;
                }
            }

            console.log(miniLocalData);

            setLocalData({...miniLocalData})
            onDataChanged({...localData!, [name]: value});
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
                <Grid2 size={{xs: 12}}>
                    <h1 style={{textAlign: "center"}}>Balance Your Universe, One Day at a Time!</h1>
                    <h3 style={{textAlign: "center"}}>Sign up now!</h3>
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
            </Grid2>
        </>
    );
}
