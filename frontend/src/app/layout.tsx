"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./globals.css";
import {useState} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark", // Enable dark mode for space vibes
        background: {
            default: "#0d0f1b", // Deep space background
            paper: "#1a1e33", // Slightly lighter card/modal background
        },
        primary: {
            main: "#e4d9ff", // Soft purple glow
        },
        secondary: {
            main: "#8be9fd", // Light blue accent, like a nebula
        },
        info: {
            main: "#bd93f9", // Light violet (cosmic tone)
        },
        success: {
            main: "#50fa7b", // Alien green
        },
        error: {
            main: "#ff5555", // Warning red
        },
        text: {
            primary: "#eaeaea",
            secondary: "#aaa",
        },
    },
    typography: {
        fontFamily: "'Orbitron', 'Segoe UI', sans-serif",
        h1: {
            fontWeight: 700,
            letterSpacing: "0.05em",
        },
        button: {
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "0.1em",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    background: "linear-gradient(145deg, #2e2a4f, #3d3761)",
                    boxShadow: "0 0 10px #a991f7",
                    color: "#e4d9ff",
                    ":hover": {
                        background: "linear-gradient(145deg, #3d3761, #2e2a4f)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: "#ffffff",
                    boxShadow: "0 0 10px rgba(138, 43, 226, 0.3)",
                    borderRadius: "16px",
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    background: "#ffffff"
                }
            }
        }
    },
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
