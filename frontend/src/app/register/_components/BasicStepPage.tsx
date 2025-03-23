import { Container, Grid2, TextField } from "@mui/material";
import { RegistrationDTO } from "@/app/register/registration_dto";
import { useEffect, useState } from "react";

interface BasicStepPageProps {
    signUpForm: RegistrationDTO;
    onDataChanged: (data: RegistrationDTO) => void;
}

export default function BasicStepPage({ signUpForm, onDataChanged }: BasicStepPageProps) {
    const [localData, setLocalData] = useState<RegistrationDTO | null>(null); // Initialize with null

    useEffect(() => {
        // Ensure data is set only after the component has mounted on the client
        setLocalData(signUpForm);
    }, [signUpForm]); // Update localData when signUpForm changes

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; // Use name attribute for key
        if (localData) {
            setLocalData((prevData) => ({
                ...prevData!,
                [name]: value,
            }));
            onDataChanged({ ...localData!, [name]: value }); // Call onDataChanged to propagate the change
        }
    };

    if (!localData) {
        return <div>Loading...</div>; // Prevent rendering until localData is available
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
                        />
                        <TextField
                            id="password"
                            className="signup-fields"
                            label="Password"
                            type="password"
                            fullWidth
                            name="password" // Add name attribute to match the state property
                            value={localData.password}
                            onChange={handleChange}
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
