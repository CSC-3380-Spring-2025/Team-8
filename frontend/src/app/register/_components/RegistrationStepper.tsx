import {useState} from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicStepPage from "@/app/register/_components/BasicStepPage";
import {BadSignupRequest, RegistrationDTO} from "@/app/register/registration_dto";
import Step2Registration from "./Step2RegisterPage";
import VerificationPage from "./VerificationPage";
import {Alert} from "@mui/material";
import axios from "axios";
import {useRouter} from "next/navigation";


const steps = ['Basic Information', "Personal Information", "Verify"];

export default function RegistrationStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [submitError, setSubmitError] = useState("");
    const [signUp, setSignUp] = useState<RegistrationDTO>({
        email: "",
        password: "",
        name: "",
        username: "",
        isEmailValid: false,
        isUsernameValid: false,
    });
    const router = useRouter();

    function handleSignUpForm(signUp: RegistrationDTO) {
        setSignUp(signUp);
    }

    const toFormData = (data: RegistrationDTO): FormData => {
        const formData = new FormData();

        // Add only the required fields (excluding isUsernameValid & isEmailValid)
        Object.entries(data).forEach(([key, value]) => {
            if (key !== "isUsernameValid" && key !== "isEmailValid" && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        return formData;
    };

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            // Handle submission
            await axios.post("https://localhost:7044/api/authenticate/signup",
                toFormData(signUp),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )
                .then(response => {
                    let data = response.data;
                    localStorage.setItem("authToken", data.token);

                    // Navigate to the personal dashboard page
                    router.push("/friends");
                }).catch(error => {
                    console.log(error);

                    try {
                        let data: BadSignupRequest = error.response.data;
                        console.log(data);
                        let errorText = "They are errors with your submission: \n";
                        console.log(data.passwordValidationError);
                        if (data.passwordValidationError) {
                            for (let i = 0; i < data.passwordValidationError?.length; i++) {
                                errorText += `\t ${data.passwordValidationError[i]} \n`;
                                console.log("LOOPING")
                            }
                        }
                        if (data.error) {
                            for (let i = 0; i < data.error.length; i++) {
                                errorText += `\t ${data.error[i]}`;
                            }
                        }
                        setSubmitError(errorText);
                        console.log(errorText);
                    } catch {
                        setSubmitError("Error when trying to create account try again later.");
                    }
                })


        } else {
            let movingOn = false;

            if (activeStep == 0 && signUp.isEmailValid && signUp.password) {
                movingOn = true;
            } else if (activeStep == 1 && signUp.isUsernameValid && signUp.name) {
                movingOn = true;
            }

            if (movingOn) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }

            console.log("The step is: " + activeStep);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

        console.log("The step is: " + activeStep);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{mt: 2, mb: 1}}>
                        A New Galaxy Awaits – Get Ready To TAKE OFF!
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <>
                    {
                        activeStep == 0 ? (
                            <BasicStepPage signUpForm={signUp} onDataChanged={handleSignUpForm}/>
                        ) : (
                            activeStep == 1 ? (
                                <Step2Registration signUpForm={signUp} onDataChanged={handleSignUpForm}/>
                            ) : (
                                <VerificationPage signUpForm={signUp}/>
                            )
                        )
                    }
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Back
                        </Button>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </>
            )}
            {
                activeStep == steps.length - 1 && submitError ? (
                    <Alert severity="error">
                        {submitError}
                    </Alert>
                ) : (
                    <></>
                )
            }
        </Box>
    );
}
