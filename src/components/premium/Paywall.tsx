import { Check, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PaymentModal from "./PaymentModal";

interface PaywallProps {
	onUnlocked?: () => void;
}

export default function Paywall({ onUnlocked }: PaywallProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Card className="border-dashed">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-4 w-4" /> Advanced Tutorials
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<ul className="text-sm space-y-1">
						<li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Access to Advanced Tutorials</li>
					</ul>
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold">₹799</span>
						<Button onClick={() => setOpen(true)}>Unlock</Button>
					</div>
				</CardContent>
			</Card>
			<PaymentModal open={open} onOpenChange={setOpen} onSuccess={onUnlocked} />
		</>
	);
}


