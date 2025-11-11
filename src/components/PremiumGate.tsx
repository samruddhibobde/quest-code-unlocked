import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock } from "lucide-react";
import PaymentModal from "@/components/premium/PaymentModal";

interface PremiumGateProps {
	children: ReactNode;
	title?: string;
}

export default function PremiumGate({ children, title = "Advanced Tutorials" }: PremiumGateProps) {
	const [open, setOpen] = useState(false);
	const isPremium = localStorage.getItem("codequest-premium") === "true" || localStorage.getItem("premiumAccess") === "true";

	if (isPremium) return <>{children}</>;

	return (
		<div className="relative">
			<div className="opacity-60 pointer-events-none select-none">{children}</div>
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4" /> {title}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<ul className="text-sm space-y-1">
							<li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Access to Advanced Tutorials</li>
						</ul>
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold">₹799</span>
							<div className="flex gap-2">
								<Button variant="secondary">Preview</Button>
								<Button onClick={() => setOpen(true)}>Unlock</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<PaymentModal
				open={open}
				onOpenChange={setOpen}
				onSuccess={() => {
					localStorage.setItem("premiumAccess", "true");
				}}
			/>
		</div>
	);
}


