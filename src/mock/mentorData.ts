export type StudentPerformance = "Weak" | "Bright" | "Average";

export interface MentorStudent {
	id: number;
	name: string;
	level: string;
	language: string;
	progress: number;
	performance: StudentPerformance;
	lastActive: string;
}

export interface MentorSession {
	id: number;
	title: string;
	student: string;
	time: string;
	status: "Upcoming" | "Ongoing" | "Completed";
}

export const students: MentorStudent[] = [
	{ id: 1, name: "Aarav Mehta", level: "Intermediate", language: "Python", progress: 72, performance: "Weak", lastActive: "2h ago" },
	{ id: 2, name: "Riya Sharma", level: "Advanced", language: "Java", progress: 91, performance: "Bright", lastActive: "30m ago" },
	{ id: 3, name: "Ishaan Verma", level: "Beginner", language: "JavaScript", progress: 34, performance: "Weak", lastActive: "1d ago" },
	{ id: 4, name: "Neha Gupta", level: "Advanced", language: "C++", progress: 88, performance: "Bright", lastActive: "10m ago" },
	{ id: 5, name: "Kabir Rao", level: "Intermediate", language: "Python", progress: 76, performance: "Average", lastActive: "3h ago" },
];

export const sessions: MentorSession[] = [
	{ id: 1, title: "Debugging Practice", student: "Aarav Mehta", time: "Today 5 PM", status: "Upcoming" },
	{ id: 2, title: "DSA Recap", student: "Riya Sharma", time: "Tomorrow 11 AM", status: "Upcoming" },
	{ id: 3, title: "Async JS Deep Dive", student: "Ishaan Verma", time: "Fri 2 PM", status: "Upcoming" },
];

export const mentorStats = {
	totalStudents: students.length,
	weakStudents: students.filter(s => s.performance === "Weak").length,
	brightStudents: students.filter(s => s.performance === "Bright").length,
	pendingFeedbacks: 4,
	activeSessions: sessions.length,
};


