"use client";

import { Grid2 } from "@mui/material";
import Navbar from "../_global_components/Navbar";
import LoginForm from "./_components/LoginForm";

export default function Page() {
	return (
		<>
			<Navbar />
			<div
				style={{
					padding: "0 1rem",
				}}
			>
				<Grid2 container>
					<Grid2
						size={{ xs: 12 }}
						sx={{ paddingX: "4rem", paddingY: "2rem" }}
					>
						<LoginForm />
					</Grid2>
				</Grid2>
			</div>
		</>
	);
}
