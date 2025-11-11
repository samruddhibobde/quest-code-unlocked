import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { payments } from "@/mock/adminData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
	const [items, setItems] = useState([...payments]);
	return (
		<Layout>
			<div className="container mx-auto max-w-5xl p-6 space-y-6">
				<BackButton />
				<Card>
					<CardHeader><CardTitle>Payments</CardTitle></CardHeader>
					<CardContent className="space-y-2">
						{items.map(p => (
							<div key={p.id} className="p-3 border rounded flex items-center justify-between">
								<div>
									<p className="font-medium">{p.user}</p>
									<p className="text-xs text-muted-foreground">${p.amount.toFixed(2)} • {p.status}</p>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => setItems(prev => prev.map(x => x.id === p.id ? { ...x, status: "success" } : x))}>Approve</Button>
									<Button variant="destructive" onClick={() => setItems(prev => prev.map(x => x.id === p.id ? { ...x, status: "failed" } : x))}>Mark Failed</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}


