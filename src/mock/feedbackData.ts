export interface FeedbackRecord {
	id: number;
	studentName: string;
	codeSnippet: string;
	comments: Array<{ category: string; rating: number; text: string; at: string }>;
	level: "beginner" | "intermediate" | "advanced";
	language: string;
	submittedAt: string;
}

export const feedbackSubmissions: FeedbackRecord[] = [
	{
		id: 1,
		studentName: "Aarav Mehta",
		codeSnippet: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        m = target - n
        if m in seen:
            return [seen[m], i]
        seen[n] = i
    return []`,
		comments: [],
		level: "beginner",
		language: "Python",
		submittedAt: "2025-11-09 17:22",
	},
];


