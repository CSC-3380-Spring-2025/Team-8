import { Avatar, Grid2, List, ListItem, ListItemText } from "@mui/material";
import { TaskActivityView } from "../friendsType";
import dayjs from "dayjs";

export default function FriendActivityStepper({
	allRecentActivity,
}: {
	allRecentActivity: TaskActivityView[];
}) {
	return (
		<div>
			<Grid2
				container
				spacing={2}
				sx={{ padding: 2, borderRadius: 2 }}
			>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<h2>Recent activity</h2>

					{allRecentActivity.length === 0 && (
						<p>No recent activity</p>
					)}
					<List>
						{allRecentActivity.map((activity, index) => (
							<ListItem
								key={index}
								sx={{
									padding: 2,
									marginBottom: 1,
									borderRadius: 2,
									backgroundColor: "rgba(255, 255, 255, 1)",
									color: "black",
								}}
							>
								<Avatar>{activity.name.substring(0, 2)}</Avatar>
								<ListItemText
									primary={`${activity.name} (${activity.username})`}
									secondary={`Completed ${
										activity.title
									} on ${dayjs(activity.completedAt).format(
										"MMM D, YYYY"
									)}`}
									sx={{ marginLeft: 2, color: "black" }}
								/>
							</ListItem>
						))}
					</List>
				</Grid2>
			</Grid2>
		</div>
	);
}
