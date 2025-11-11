import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/mock/adminData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
	const [items, setItems] = useState(users.map(u => ({ ...u })));
	return (
		<Layout>
			<div className="container mx-auto max-w-5xl p-6 space-y-6">
				<BackButton />
				<Card>
					<CardHeader><CardTitle>Users</CardTitle></CardHeader>
					<CardContent className="space-y-2">
						{items.map(u => (
							<div key={u.id} className="p-3 border rounded flex items-center justify-between">
								<div>
									<p className="font-medium">{u.name}</p>
									<p className="text-xs text-muted-foreground">{u.role} • {u.status}</p>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => setItems(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "banned" : "active" } : x))}>
										{u.status === "active" ? "Ban" : "Unban"}
									</Button>
									<Button onClick={() => alert("Reset password (mock)")}>Reset Password</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}


