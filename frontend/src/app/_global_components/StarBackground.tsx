"use client";

import { useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";

interface Star {
	x: number;
	y: number;
	size: number;
	speed: number;
	brightness: number;
}

interface StarBackgroundProps {
	starCount?: number;
	maxStarSize?: number;
	minStarSize?: number;
	speed?: number;
	backgroundColor?: string;
}

const CanvasContainer = styled(Box)({
	position: "fixed",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	zIndex: -1,
});

export default function StarBackground({
	starCount = 200,
	maxStarSize = 3,
	minStarSize = 0.5,
	speed = 0.2,
	backgroundColor = "#0a0a1a",
}: StarBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const starsRef = useRef<Star[]>([]);
	const animationFrameRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas to full screen
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Regenerate stars when resizing
			initStars();
		};

		// Initialize stars
		const initStars = () => {
			starsRef.current = [];
			for (let i = 0; i < starCount; i++) {
				starsRef.current.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size:
						Math.random() * (maxStarSize - minStarSize) +
						minStarSize,
					speed: Math.random() * speed + speed / 2,
					brightness: Math.random() * 0.5 + 0.5,
				});
			}
		};

		// Animation loop
		const animate = () => {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw and update stars
			starsRef.current.forEach((star) => {
				// Draw star
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
				ctx.fill();

				// Move star
				star.x -= star.speed;

				// Reset star position when it goes off screen
				if (star.x < -star.size) {
					star.x = canvas.width + star.size;
					star.y = Math.random() * canvas.height;
				}
			});

			animationFrameRef.current = requestAnimationFrame(animate);
		};

		// Set up canvas and start animation
		handleResize();
		window.addEventListener("resize", handleResize);
		animate();

		// Clean up
		return () => {
			window.removeEventListener("resize", handleResize);
			cancelAnimationFrame(animationFrameRef.current);
		};
	}, [starCount, maxStarSize, minStarSize, speed, backgroundColor]);

	return (
		<CanvasContainer>
			<canvas
				ref={canvasRef}
				style={{ display: "block", background: backgroundColor }}
			/>
		</CanvasContainer>
	);
}
