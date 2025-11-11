export interface MentorRequest {
	id: number;
	student: string;
	topic: string;
	status: "Pending" | "Approved" | "Rejected";
}

export const mentorRequests: MentorRequest[] = [
	{ id: 1, student: "Riya Sharma", topic: "Loops in Python", status: "Pending" },
];


