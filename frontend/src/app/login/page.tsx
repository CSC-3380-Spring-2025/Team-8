"use client";

import { Container, Grid2 } from "@mui/material";
import Navbar from "../_global_components/Navbar";
import LoginForm from "./_components/LoginForm";

export default function Page() {
    return (
        <>
            <Navbar/>
            <div style={{
                padding: "0 1rem"
            }}>
                <Grid2 container>
                    <Grid2 size={{xs: 12, md: 6}}>
                        <LoginForm/>
                    </Grid2>
                    <Grid2 size={{ xs: 0, md: 6 }}>
                        <Container>
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
            </div>
            
        </>
    )
}