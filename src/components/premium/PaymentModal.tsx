import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export default function PaymentModal({ open, onOpenChange, onSuccess }: PaymentModalProps) {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [card, setCard] = useState("");
	const [expiry, setExpiry] = useState("");
	const [cvv, setCvv] = useState("");
	const [coupon, setCoupon] = useState("");

	const pay = async () => {
		setLoading(true);
		await new Promise(r => setTimeout(r, 700));
		const fail = coupon.toLowerCase() === "fail";
		setLoading(false);
		if (fail) {
			toast({ title: "Payment failed", description: "Please retry or cancel.", variant: "destructive" });
			return;
		}
		localStorage.setItem("codequest-premium", "true");
		toast({ title: "Payment successful", description: "Premium unlocked!" });
		onSuccess?.();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Unlock Advanced Tutorials</DialogTitle>
					<DialogDescription>Access to advanced tutorials requires premium. Mock payment. Use coupon 'fail' to simulate an error.</DialogDescription>
				</DialogHeader>
				<div className="p-4 bg-muted rounded-lg mb-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Premium Access</span>
						<span className="text-lg font-bold">₹799</span>
					</div>
					<p className="text-xs text-muted-foreground mt-1">Unlocks access to advanced tutorials</p>
				</div>
				<div className="grid gap-3">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
					</div>
					<div>
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<Label htmlFor="card">Card Number</Label>
						<Input id="card" value={card} onChange={(e) => setCard(e.target.value)} placeholder="4242 4242 4242 4242" />
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label htmlFor="expiry">Expiry</Label>
							<Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="12/28" />
						</div>
						<div>
							<Label htmlFor="cvv">CVV</Label>
							<Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
						</div>
					</div>
					<div>
						<Label htmlFor="coupon">Coupon (optional)</Label>
						<Input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="SAVE20" />
					</div>
					<div className="flex gap-2 justify-end">
						<Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
						<Button onClick={pay} disabled={loading}>{loading ? "Processing..." : `Pay ₹799`}</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}


