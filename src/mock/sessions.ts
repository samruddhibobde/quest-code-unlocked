export interface MentorSessionItem {
	id: number;
	title: string;
	student: string;
	time: string;
	status: "Scheduled" | "Completed";
}

export const upcomingSessions: MentorSessionItem[] = [
	{ id: 200, title: "Debugging Practice", student: "Aarav Mehta", time: "Today 5 PM", status: "Scheduled" },
];

export const pastSessions: MentorSessionItem[] = [
	{ id: 150, title: "DSA Recap", student: "Riya Sharma", time: "Nov 3, 11 AM", status: "Completed" },
];


