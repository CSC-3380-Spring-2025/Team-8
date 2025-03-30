"use client"

import { useRef, useEffect } from "react"
import { Box } from "@mui/material"

interface BlackHoleVisualizationProps {
    progress: number
    isBreak: boolean
}

export function BlackHoleVisualization({ progress, isBreak }: BlackHoleVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()

        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr

        ctx.scale(dpr, dpr)

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height)

        // Center coordinates
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Black hole parameters
        const maxRadius = Math.min(centerX, centerY) * 0.8
        const currentRadius = maxRadius * (0.3 + (progress / 100) * 0.7)

        // Event horizon (black hole)
        ctx.beginPath()
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#000000"
        ctx.fill()

        // Accretion disk
        const diskWidth = currentRadius * 0.5
        const innerRadius = currentRadius
        const outerRadius = innerRadius + diskWidth

        // Create gradient for accretion disk
        const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius)

        if (isBreak) {
            // Cooler colors for break
            gradient.addColorStop(0, "rgba(138, 43, 226, 1)") // Purple
            gradient.addColorStop(0.5, "rgba(0, 229, 255, 0.8)") // Cyan
            gradient.addColorStop(1, "rgba(0, 229, 255, 0)") // Transparent
        } else {
            // Hotter colors for work session
            gradient.addColorStop(0, "rgba(255, 69, 0, 1)") // Red-orange
            gradient.addColorStop(0.5, "rgba(255, 215, 0, 0.8)") // Gold
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)") // Transparent
        }

        // Draw accretion disk
        ctx.beginPath()
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw gravitational lensing effect
        const lensStrength = progress / 100
        const numRays = 12
        const rayLength = maxRadius * 1.5

        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2
            const startX = centerX + Math.cos(angle) * currentRadius
            const startY = centerY + Math.sin(angle) * currentRadius

            const endX = centerX + Math.cos(angle) * rayLength
            const endY = centerY + Math.sin(angle) * rayLength

            const controlX = centerX + (Math.cos(angle + 0.2 * lensStrength) * (currentRadius + rayLength)) / 2
            const controlY = centerY + (Math.sin(angle + 0.2 * lensStrength) * (currentRadius + rayLength)) / 2

            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.quadraticCurveTo(controlX, controlY, endX, endY)

            const rayGradient = ctx.createLinearGradient(startX, startY, endX, endY)

            if (isBreak) {
                rayGradient.addColorStop(0, "rgba(138, 43, 226, 0.8)")
                rayGradient.addColorStop(1, "rgba(0, 229, 255, 0)")
            } else {
                rayGradient.addColorStop(0, "rgba(255, 69, 0, 0.8)")
                rayGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
            }

            ctx.strokeStyle = rayGradient
            ctx.lineWidth = 2 + lensStrength * 3
            ctx.stroke()
        }
    }, [progress, isBreak])

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </Box>
    )
}

