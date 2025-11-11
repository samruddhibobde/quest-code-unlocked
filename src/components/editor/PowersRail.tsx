import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bolt, Wand2, Bug, Eye } from "lucide-react";

const POWERS = [
	{ id: "hint", label: "Hint", icon: Wand2, threshold: 3 },
	{ id: "format", label: "Auto-format", icon: Bolt, threshold: 5 },
	{ id: "trace", label: "Debug Trace", icon: Bug, threshold: 8 },
	{ id: "reveal", label: "Reveal 1 hidden test", icon: Eye, threshold: 12 },
];

export default function PowersRail() {
	const [solved, setSolved] = useState<number>(parseInt(localStorage.getItem("solvedCount") || "0", 10));

	useEffect(() => {
		const id = setInterval(() => {
			setSolved(parseInt(localStorage.getItem("solvedCount") || "0", 10));
		}, 2000);
		return () => clearInterval(id);
	}, []);

	return (
		<Card className="border-dashed">
			<CardHeader>
				<CardTitle className="text-sm">Powers</CardTitle>
			</CardHeader>
			<CardContent className="flex gap-2">
				<TooltipProvider>
					{POWERS.map((p) => {
						const Icon = p.icon;
						const unlocked = solved >= p.threshold;
						return (
							<Tooltip key={p.id}>
								<TooltipTrigger asChild>
									<div
										className={`p-2 rounded border ${unlocked ? "border-primary text-primary" : "border-border text-muted-foreground opacity-60"}`}
										role="button"
										aria-disabled={!unlocked}
									>
										<Icon className="h-4 w-4" />
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{p.label} {unlocked ? "(Unlocked)" : `(Unlocks at ${p.threshold} solved)`}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</TooltipProvider>
			</CardContent>
		</Card>
	);
}


