export interface TutorialUpload {
	id: number;
	title: string;
	description: string;
	category: "Beginner" | "Intermediate" | "Advanced";
	language: string;
	fileName?: string;
	status: "Draft" | "Published";
}

export const tutorialUploads: TutorialUpload[] = [
	{ id: 1, title: "Intro to Arrays", description: "Basics of arrays", category: "Beginner", language: "JavaScript", status: "Published" },
];


