export const adminAnalytics = {
	dau: 1240,
	mau: 5320,
	completionRate: 68,
	attempts: 12450,
	payments: { success: 320, pending: 18, failed: 7 },
	loginsToday: 412,
	revenueMonth: 2890.75,
	premiumSubscribers: 860,
};

export const moderationQueue = [
	{ id: 1, type: "challenge", title: "Offensive content", status: "pending" },
	{ id: 2, type: "comment", title: "Spam", status: "pending" },
];

export const users = [
	{ id: 1, name: "Learner One", role: "learner", status: "active" },
	{ id: 2, name: "Mentor Pro", role: "mentor", status: "active" },
	{ id: 3, name: "Admin Chief", role: "admin", status: "active" },
];

export const payments = [
	{ id: 101, user: "Learner One", amount: 9.99, status: "success" },
	{ id: 102, user: "Learner Two", amount: 9.99, status: "pending" },
	{ id: 103, user: "Learner Three", amount: 9.99, status: "failed" },
];

export const certificates = [
	{ id: 1, learner: "Learner One", course: "Python Basics", date: "2025-10-01", status: "Issued" },
	{ id: 2, learner: "Riya Sharma", course: "Java Foundations", date: "2025-11-05", status: "Issued" },
];

export const loginEvents = [
	{ id: 1, user: "Learner One", role: "learner", time: "10:05 AM" },
	{ id: 2, user: "Riya Sharma", role: "learner", time: "10:12 AM" },
	{ id: 3, user: "Mentor Pro", role: "mentor", time: "10:20 AM" },
];

export const paidTutorials = [
	{ id: 1, title: "Advanced DSA Patterns", mentor: "Mentor Pro", status: "Published" },
	{ id: 2, title: "Async Mastery", mentor: "Mentor Pro", status: "Pending Approval" },
];


