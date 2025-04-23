"use client";

import {Container} from "@mui/material";
import Navbar from "@/app/_global_components/Navbar";

export default function Page() {
    return (
        <>
            <Navbar/>
            <Container>
                <h1>Hello, from the dashboard.</h1>
            </Container>
        </>
    )
}