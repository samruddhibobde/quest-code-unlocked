type Lang = "en" | "hi" | "mr" | "ta" | "te" | "bn";

const dict: Record<Lang, Record<string, string>> = {
	en: { login: "Login", chooseAvatar: "Choose your Avatar", language: "Language" },
	hi: { login: "लॉगिन", chooseAvatar: "अपना अवतार चुनें", language: "भाषा" },
	mr: { login: "लॉगिन", chooseAvatar: "तुमचा अवतार निवडा", language: "भाषा" },
	ta: { login: "உள்நுழை", chooseAvatar: "உங்கள் அவதாரம் தேர்வு", language: "மொழி" },
	te: { login: "లాగిన్", chooseAvatar: "మీ అవతార్ ఎంచుకోండి", language: "భాష" },
	bn: { login: "লগইন", chooseAvatar: "আপনার অবতার বাছাই করুন", language: "ভাষা" },
};

export function setUiLang(lang: Lang) {
	localStorage.setItem("uiLang", lang);
}

export function getUiLang(): Lang {
	return (localStorage.getItem("uiLang") as Lang) || "en";
}

export function t(key: string): string {
	const lang = getUiLang();
	return dict[lang][key] || dict.en[key] || key;
}


