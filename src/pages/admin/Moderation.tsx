import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moderationQueue } from "@/mock/adminData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminModerationPage() {
	const [items, setItems] = useState([...moderationQueue]);
	return (
		<Layout>
			<div className="container mx-auto max-w-5xl p-6 space-y-6">
				<BackButton />
				<Card>
					<CardHeader><CardTitle>Moderation Queue</CardTitle></CardHeader>
					<CardContent className="space-y-2">
						{items.map(it => (
							<div key={it.id} className="p-3 border rounded flex items-center justify-between">
								<div>
									<p className="font-medium">{it.title}</p>
									<p className="text-xs text-muted-foreground">{it.type} • {it.status}</p>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => setItems(prev => prev.filter(x => x.id !== it.id))}>Approve</Button>
									<Button variant="destructive" onClick={() => setItems(prev => prev.filter(x => x.id !== it.id))}>Reject</Button>
								</div>
							</div>
						))}
						{items.length === 0 && <p className="text-sm text-muted-foreground">No items in queue.</p>}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}


