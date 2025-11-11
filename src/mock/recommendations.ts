export interface RecommendationProfile {
	accuracyByTopic: Record<string, number>;
	attempts: Record<string, number>;
	timePerQuestion: Record<string, number>;
}

export function getProfile(): RecommendationProfile {
	const raw = localStorage.getItem("recoProfile");
	if (raw) return JSON.parse(raw);
	const base: RecommendationProfile = {
		accuracyByTopic: { loops: 0.6, arrays: 0.5, recursion: 0.4 },
		attempts: { loops: 2, arrays: 4, recursion: 5 },
		timePerQuestion: { loops: 90, arrays: 120, recursion: 180 },
	};
	localStorage.setItem("recoProfile", JSON.stringify(base));
	return base;
}

export function recommendNext(): { topic: string; reason: string } {
	const p = getProfile();
	const worst = Object.entries(p.accuracyByTopic).sort((a, b) => a[1] - b[1])[0]?.[0] || "arrays";
	return { topic: worst, reason: "Lowest accuracy" };
}


