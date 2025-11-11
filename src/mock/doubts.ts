export interface StudentDoubt {
	id: number;
	student: string;
	topic: string;
	description: string;
	createdAt: string;
	status: "Open" | "Resolved";
}

export const studentDoubts: StudentDoubt[] = [
	{ id: 1, student: "Aarav Mehta", topic: "Syntax", description: "Confused about Python indentation rules.", createdAt: "2h ago", status: "Open" },
	{ id: 2, student: "Riya Sharma", topic: "DSA", description: "Time complexity of binary search variants.", createdAt: "1d ago", status: "Open" },
];


