import {useState} from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicStepPage from "@/app/register/_components/BasicStepPage";
import {RegistrationDTO} from "@/app/register/registration_dto";

const steps = ['Basic', "Personal", "Verify"];

export default function RegistrationStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [signUp, setSignUp] = useState<RegistrationDTO>({
        email: "",
        password: "",
        name: "",
        username: "",
        isEmailValid: false,
        isUsernameValid: false,
    });

    function handleSignUpForm(signUp: RegistrationDTO) {
        setSignUp(signUp);
    }

    const handleNext = () => {
        let canMoveOn = false;

        if(activeStep == 0 && signUp.isEmailValid && signUp.password) {
            canMoveOn = true;
        } else if(activeStep == 1 && signUp.isUsernameValid) {
            canMoveOn = true;
        }
        
        if(canMoveOn) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }

        console.log("The step is: " + activeStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

        console.log("The step is: " + activeStep);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
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
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Confirm your information.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <>
                    {
                        activeStep == 0 ? (
                            <BasicStepPage signUpForm={signUp} onDataChanged={handleSignUpForm}/>
                        ) : (
                            <h1>ANOTHER </h1>
                        )
                    }
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
