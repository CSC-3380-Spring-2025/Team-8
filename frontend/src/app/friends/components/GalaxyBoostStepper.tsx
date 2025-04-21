import { Avatar, Grid2, List, ListItem, ListItemText } from "@mui/material";
import { GalaxyBoostRes, UserFriendsRes } from "../friendsType";
import { RocketLaunch } from "@mui/icons-material";
import SendGalaxyBoost from "./SendGalaxyBoost";

export default function GalaxyBoostStepper({
	galaxyBoostsRes,
}: {
	galaxyBoostsRes: GalaxyBoostRes[];
}) {
	return (
		<div>
			<Grid2
				container
				spacing={2}
				sx={{ padding: 2, borderRadius: 2 }}
			>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Galaxy Boostsss</h2>
					{galaxyBoostsRes.length === 0 && (
						<p>No recent galaxy boosts</p>
					)}
					<List>
						{galaxyBoostsRes.map((boost, index) => (
							<ListItem
								key={index}
								sx={{
									padding: 2,
									backgroundColor: "white",
									marginBottom: 1,
									borderRadius: 2,
								}}
							>
								<Avatar>
									{boost.sender_name.substring(0, 2)}
								</Avatar>
								<ListItemText
									primary={boost.message}
									secondary={`Boost from ${boost.sender_name}`}
									sx={{ marginLeft: 2, color: "black" }}
								/>
								<RocketLaunch
									sx={{ marginLeft: "auto", color: "black" }}
								/>
							</ListItem>
						))}
					</List>
				</Grid2>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Send a galaxy boost!</h2>
					<SendGalaxyBoost />
				</Grid2>
			</Grid2>
		</div>
	);
}
