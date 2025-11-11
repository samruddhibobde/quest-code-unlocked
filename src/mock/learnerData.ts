export interface LanguageItem {
	id: string;
	name: string;
	icon: string;
	description: string;
}

export const languages: LanguageItem[] = [
	{ id: "c", name: "C", icon: "🔧", description: "Low-level systems programming" },
	{ id: "cpp", name: "C++", icon: "🧩", description: "OOP and performance" },
	{ id: "java", name: "Java", icon: "☕", description: "Enterprise and Android" },
	{ id: "python", name: "Python", icon: "🐍", description: "Scripting and ML" },
	{ id: "javascript", name: "JavaScript", icon: "✨", description: "Web development" },
	{ id: "typescript", name: "TypeScript", icon: "🛡️", description: "Typed JavaScript" },
	{ id: "go", name: "Go", icon: "🐹", description: "Cloud-native simplicity" },
	{ id: "kotlin", name: "Kotlin", icon: "🧠", description: "Modern JVM and Android" },
	{ id: "swift", name: "Swift", icon: "🕊️", description: "iOS and macOS" },
	{ id: "ruby", name: "Ruby", icon: "💎", description: "Elegant scripting" },
	{ id: "rust", name: "Rust", icon: "🦀", description: "Memory-safe performance" },
	{ id: "php", name: "PHP", icon: "🐘", description: "Server-side scripting" },
];

export const lessons = [
	{ id: 1, title: "Intro to Variables", level: "beginner", premium: false },
	{ id: 2, title: "Data Structures", level: "intermediate", premium: false },
	{ id: 3, title: "Advanced Patterns", level: "advanced", premium: true },
];

export function fakeLatency<T>(data: T, ms = 500): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}


