"use client"

import { useState, useEffect, useRef } from "react"
import { Button, Typography, Box, Slider, IconButton } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SettingsIcon from "@mui/icons-material/Settings"
import {BlackHoleVisualization} from "@/app/dashboard/_components/pomodoro/blackhole-visualization";

// Create a dark theme with space-inspired colors
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#8e24aa", // Purple
        },
        secondary: {
            main: "#00e5ff", // Cyan
        },
        background: {
            default: "#000000",
            paper: "rgba(13, 13, 30, 0.8)",
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Arial', sans-serif",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 28,
                },
            },
        },
    },
})

type TimerState = "idle" | "running" | "paused" | "break"

export function SpacePomodoro() {
    // Default session durations in minutes
    const defaultWorkDuration = 25
    const defaultBreakDuration = 5

    // State for timer
    const [timerState, setTimerState] = useState<TimerState>("idle")
    const [timeLeft, setTimeLeft] = useState(defaultWorkDuration * 60)
    const [workDuration, setWorkDuration] = useState(defaultWorkDuration)
    const [breakDuration, setBreakDuration] = useState(defaultBreakDuration)
    const [showSettings, setShowSettings] = useState(false)
    const [sessionCount, setSessionCount] = useState(0)

    // Reference to keep track of the interval
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Calculate progress percentage for visualization
    const getProgressPercentage = () => {
        const totalTime = timerState === "break" ? breakDuration * 60 : workDuration * 60
        return (1 - timeLeft / totalTime) * 100
    }

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Start the timer
    const startTimer = () => {
        if (timerState === "idle" || timerState === "paused") {
            setTimerState("running")

            // Clear any existing interval
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }

            // Set up a new interval
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        // Time's up - switch between work and break
                        if (timerState === "break") {
                            // Break is over, start a new work session
                            setTimerState("running")
                            setSessionCount((prev) => prev + 1)
                            return workDuration * 60
                        } else {
                            // Work session is over, start a break
                            setTimerState("break")
                            return breakDuration * 60
                        }
                    }
                    return prevTime - 1
                })
            }, 1000)
        }
    }

    // Pause the timer
    const pauseTimer = () => {
        if (timerState === "running" || timerState === "break") {
            setTimerState(timerState === "break" ? "break" : "paused")
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
        }
    }

    // Reset the timer
    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        setTimerState("idle")
        setTimeLeft(workDuration * 60)
        setSessionCount(0)
    }

    // Toggle settings panel
    const toggleSettings = () => {
        setShowSettings(!showSettings)
    }

    // Update work duration
    const handleWorkDurationChange = (_event: Event, newValue: number | number[]) => {
        const value = newValue as number
        setWorkDuration(value)
        if (timerState === "idle") {
            setTimeLeft(value * 60)
        }
    }

    // Update break duration
    const handleBreakDurationChange = (_event: Event, newValue: number | number[]) => {
        setBreakDuration(newValue as number)
    }

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    // Get the current session label
    const getSessionLabel = () => {
        if (timerState === "break") {
            return "Break Time"
        } else {
            return `Focus Session ${sessionCount + 1}`
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: "500px",
                    padding: 4,
                    borderRadius: 4,
                    backgroundColor: "background.paper",
                    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom color="secondary">
                    Cosmic Pomodoro
                </Typography>

                <Typography variant="h6" color={timerState === "break" ? "primary" : "secondary"}>
                    {getSessionLabel()}
                </Typography>

                <Box sx={{ position: "relative", width: "100%", height: "300px", my: 2 }}>
                    <BlackHoleVisualization progress={getProgressPercentage()} isBreak={timerState === "break"} />

                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: "bold",
                                color: "white",
                                textShadow: "0 0 10px rgba(142, 36, 170, 0.7), 0 0 20px rgba(142, 36, 170, 0.5)",
                            }}
                        >
                            {formatTime(timeLeft)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    {timerState === "running" || timerState === "break" ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PauseIcon />}
                            onClick={pauseTimer}
                            sx={{ minWidth: "120px" }}
                        >
                            Pause
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PlayArrowIcon />}
                            onClick={startTimer}
                            sx={{ minWidth: "120px" }}
                        >
                            Start
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<RestartAltIcon />}
                        onClick={resetTimer}
                        sx={{ minWidth: "120px" }}
                    >
                        Reset
                    </Button>

                    <IconButton color="secondary" onClick={toggleSettings}>
                        <SettingsIcon />
                    </IconButton>
                </Box>

                {showSettings && (
                    <Box sx={{ width: "100%", mt: 2 }}>
                        <Typography id="work-duration-slider" gutterBottom>
                            Work Duration: {workDuration} minutes
                        </Typography>
                        <Slider
                            value={workDuration}
                            onChange={handleWorkDurationChange}
                            aria-labelledby="work-duration-slider"
                            step={1}
                            marks
                            min={5}
                            max={60}
                            color="secondary"
                        />

                        <Typography id="break-duration-slider" gutterBottom sx={{ mt: 2 }}>
                            Break Duration: {breakDuration} minutes
                        </Typography>
                        <Slider
                            value={breakDuration}
                            onChange={handleBreakDurationChange}
                            aria-labelledby="break-duration-slider"
                            step={1}
                            marks
                            min={1}
                            max={15}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    )
}

