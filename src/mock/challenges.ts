export interface ChallengeItem {
	id: number;
	title: string;
	timeLimit: number; // seconds
}

export const challenges: ChallengeItem[] = [
	{ id: 1, title: "String Reversal", timeLimit: 600 },
	{ id: 2, title: "Two Sum", timeLimit: 900 },
];


