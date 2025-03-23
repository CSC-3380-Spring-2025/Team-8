"use client";

import RegistrationStepper from "@/app/register/_components/RegistrationStepper";
import {Container} from "@mui/material";

export default function Page() {
    return (
        <Container>
            <h1>Register</h1>
            <RegistrationStepper/>
        </Container>
    );
}