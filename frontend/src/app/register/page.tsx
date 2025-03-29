"use client";

import RegistrationStepper from "@/app/register/_components/RegistrationStepper";
import {Container} from "@mui/material";
import Navbar from "../_global_components/Navbar";

export default function Page() {
    return (
        <>
            <Navbar/>
            <Container>
                <RegistrationStepper/>
            </Container>
        </>
        
    );
}