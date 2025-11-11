import { useState } from "react";
import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { languages } from "@/mock/learnerData";
import Paywall from "@/components/premium/Paywall";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function GetStarted() {
	const { toast } = useToast();
	const navigate = useNavigate();
	const [step, setStep] = useState<1 | 2>(1);
	const [query, setQuery] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | "">("");
	const [previewOpen, setPreviewOpen] = useState(false);

	const filtered = languages.filter(l =>
		l.name.toLowerCase().includes(query.toLowerCase()),
	);

	const onContinue = () => {
		if (step === 1) {
			if (!selectedLanguage) {
				toast({ title: "Choose a language", variant: "destructive" });
				return;
			}
			setStep(2);
			return;
		}
		if (!level) {
			toast({ title: "Pick a level", variant: "destructive" });
			return;
		}
		localStorage.setItem("codequest-language", selectedLanguage);
		localStorage.setItem("codequest-level", level);
		toast({ title: "Saved!", description: "Welcome to CodeQuest." });
		navigate("/learner/dashboard");
	};

	return (
		<Layout showNav={false}>
			<div className="min-h-screen flex items-center justify-center p-4">
				<div className="w-full max-w-5xl space-y-4">
					<BackButton />
					{step === 1 ? (
						<Card className="border-primary/20">
							<CardHeader>
								<CardTitle>Select Your Language</CardTitle>
								<CardDescription>Pick from 12+ languages. Use the search to filter.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Input
									placeholder="Search languages..."
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									aria-label="Search languages"
								/>
								<div className="grid md:grid-cols-3 gap-3">
									{filtered.map((lang) => (
										<button
											key={lang.id}
											onClick={() => setSelectedLanguage(lang.id)}
											className={`p-4 rounded-lg border-2 text-left transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-ring ${
												selectedLanguage === lang.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
											}`}
											aria-pressed={selectedLanguage === lang.id}
										>
											<div className="text-3xl mb-1">{lang.icon}</div>
											<p className="font-semibold">{lang.name}</p>
											<p className="text-xs text-muted-foreground">{lang.description}</p>
										</button>
									))}
								</div>
								<div className="flex justify-end">
									<Button onClick={onContinue} disabled={!selectedLanguage}>Continue</Button>
								</div>
							</CardContent>
						</Card>
					) : (
						<Card className="border-primary/20">
							<CardHeader>
								<CardTitle>Select Level</CardTitle>
								<CardDescription>Choose your starting difficulty.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<RadioGroup value={level} onValueChange={(v) => setLevel(v as any)}>
									<div className="flex items-center space-x-2 border rounded p-3">
										<RadioGroupItem value="beginner" id="lvl-beg" />
										<Label htmlFor="lvl-beg" className="cursor-pointer">Beginner</Label>
									</div>
									<div className="flex items-center space-x-2 border rounded p-3">
										<RadioGroupItem value="intermediate" id="lvl-int" />
										<Label htmlFor="lvl-int" className="cursor-pointer">Intermediate</Label>
									</div>
									<div className="space-y-2 border rounded p-3">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="advanced" id="lvl-adv" />
											<Label htmlFor="lvl-adv" className="cursor-pointer">Advanced</Label>
											<span className="ml-2 text-xs rounded px-2 py-0.5 bg-secondary">Premium tutorials</span>
										</div>
										<div className="flex gap-2">
											<Button variant="link" className="px-0 h-auto" onClick={() => setPreviewOpen(true)}>Preview syllabus</Button>
										</div>
									</div>
								</RadioGroup>
								<Paywall />
								<div className="flex justify-between">
									<Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
									<Button onClick={onContinue}>Continue</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Advanced Syllabus (Preview)</DialogTitle>
					</DialogHeader>
					<div className="text-sm space-y-2">
						<p>• Systems design fundamentals</p>
						<p>• Advanced algorithms and patterns</p>
						<p>• Concurrency and performance</p>
					</div>
				</DialogContent>
			</Dialog>
		</Layout>
	);
}


