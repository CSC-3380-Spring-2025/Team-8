"use client";

import RegistrationStepper from "@/app/register/_components/RegistrationStepper";
import {Container} from "@mui/material";
import Navbar from "../_global_components/Navbar";
import StarBackground from "@/app/_global_components/StarBackground";

export default function Page() {
    return (
        <>
            <StarBackground/>
            <Navbar/>
            <Container>
                <RegistrationStepper/>
            </Container>
        </>
        
    );
}