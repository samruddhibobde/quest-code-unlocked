export type LessonLevel = "beginner" | "intermediate" | "advanced";

export interface LessonItem {
	id: number;
	title: string;
	level: LessonLevel;
	video?: string;
	locked?: boolean;
	duration?: string;
}

export const lessons: LessonItem[] = [
	{ id: 1, title: "Lesson 1", level: "beginner", video: "/assets/video.mp4", locked: false, duration: "6m" },
	{ id: 2, title: "Lesson 2", level: "beginner", video: "/assets/video.mp4", locked: false, duration: "7m" },
	{ id: 3, title: "Lesson 3", level: "beginner", video: "/assets/video.mp4", locked: false, duration: "8m" },
	{ id: 4, title: "Lesson 4", level: "beginner", video: "/assets/video.mp4", locked: false, duration: "5m" },
	{ id: 5, title: "Lesson 5", level: "beginner", video: "/assets/video.mp4", locked: false, duration: "9m" },

	{ id: 6, title: "Lesson 6", level: "intermediate", locked: false, duration: "10m" },
	{ id: 7, title: "Lesson 7", level: "intermediate", locked: false, duration: "9m" },
	{ id: 8, title: "Lesson 8", level: "intermediate", locked: false, duration: "8m" },
	{ id: 9, title: "Lesson 9", level: "intermediate", locked: false, duration: "11m" },
	{ id: 10, title: "Lesson 10", level: "intermediate", locked: false, duration: "12m" },

	{ id: 11, title: "Lesson 11", level: "advanced", locked: true, duration: "12m" },
	{ id: 12, title: "Lesson 12", level: "advanced", locked: true, duration: "10m" },
	{ id: 13, title: "Lesson 13", level: "advanced", locked: true, duration: "14m" },
	{ id: 14, title: "Lesson 14", level: "advanced", locked: true, duration: "9m" },
	{ id: 15, title: "Lesson 15", level: "advanced", locked: true, duration: "15m" },
];


