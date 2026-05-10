import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "@/components/mentor/SessionCard";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function MentorSessionsPage() {
	const [upcoming, setUpcoming] = useState<any[]>([]);
	const [past, setPast] = useState<any[]>([]);
	const [active, setActive] = useState<any | null>(null);
	const [roomOpen, setRoomOpen] = useState(false);
	const [scheduleOpen, setScheduleOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [student, setStudent] = useState("");
	const [time, setTime] = useState("");
	const [loadingSessions, setLoadingSessions] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;
		fetch("https://codequest-backend-yrse.onrender.com/api/users/sessions", {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => {
				const all = data.sessions || [];
				setUpcoming(all.filter((s: any) => s.status !== "Completed"));
				setPast(all.filter((s: any) => s.status === "Completed"));
			})
			.catch(() => {})
			.finally(() => setLoadingSessions(false));
	}, []);

	return (
		<Layout>
			<div className="container mx-auto max-w-7xl p-6">
				<BackButton />
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">Live Sessions</h1>
					<p className="text-muted-foreground">Monitor and manage active mentoring sessions</p>
				</div>

				<div className="flex justify-end">
					<Button onClick={() => setScheduleOpen(true)}>Schedule New Session</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Upcoming Sessions</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						{upcoming.map(s => (
							<SessionCard key={s.id} session={{ id: s.id, title: s.title, student: s.student, time: s.time, status: "Upcoming" } as any} onStart={(sess) => { setActive(s); setRoomOpen(true); }} />
						))}
						{upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming sessions.</p>}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Past Sessions</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						{past.map(s => (
							<div key={s.id} className="p-4 border rounded flex items-center justify-between">
								<div>
									<p className="font-medium">{s.title}</p>
									<p className="text-xs text-muted-foreground">{s.student} • {s.time}</p>
								</div>
								<span className="text-xs rounded-full px-2 py-1 bg-secondary text-secondary-foreground">{s.status}</span>
							</div>
						))}
						{past.length === 0 && <p className="text-sm text-muted-foreground">No past sessions.</p>}
					</CardContent>
				</Card>
			</div>

			{/* Live Session Room */}
			<Dialog open={roomOpen} onOpenChange={(o) => { if (!o) setRoomOpen(false); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{active?.title}</DialogTitle>
					</DialogHeader>
					<div className="grid md:grid-cols-2 gap-3">
						<div className="h-48 rounded bg-muted flex items-center justify-center">Learner video</div>
						<div className="h-48 rounded border p-2 overflow-auto">
							<p className="text-xs text-muted-foreground mb-2">Chat</p>
							<div className="space-y-1 text-sm">
								<p><span className="font-medium">Learner:</span> Hello mentor!</p>
								<p><span className="font-medium">Mentor:</span> Let's begin.</p>
							</div>
						</div>
					</div>
					<div className="flex justify-end">
						<Button onClick={async () => {
							if (!active) return;
							const token = localStorage.getItem("token");
							try {
								await fetch(`https://codequest-backend-yrse.onrender.com/api/users/sessions/${active.id}/complete`, {
									method: "PATCH",
									headers: { Authorization: `Bearer ${token}` },
								});
								setUpcoming(prev => prev.filter(x => x.id !== active.id));
								setPast(prev => [{ ...active, status: "Completed" }, ...prev]);
							} catch {}
							setRoomOpen(false);
						}}>End Session</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Schedule Modal */}
			<Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Schedule New Session</DialogTitle>
					</DialogHeader>
					<div className="grid gap-3">
						<div>
							<Label>Title</Label>
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
						</div>
						<div>
							<Label>Learner</Label>
							<Input value={student} onChange={(e) => setStudent(e.target.value)} />
						</div>
						<div>
							<Label>Time</Label>
							<Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., Tomorrow 3 PM" />
						</div>
						<div className="flex justify-end">
							<Button onClick={async () => {
								if (!title || !student || !time) return;
								const token = localStorage.getItem("token");
								try {
									const res = await fetch("https://codequest-backend-yrse.onrender.com/api/users/sessions", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${token}`,
										},
										body: JSON.stringify({ title, student, time }),
									});
									const data = await res.json();
									setUpcoming(prev => [data.session, ...prev]);
									setScheduleOpen(false);
									setTitle(""); setStudent(""); setTime("");
								} catch {
									toast({ title: "Failed to schedule session", variant: "destructive" });
								}
							}}>Add</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</Layout>
	);
}


