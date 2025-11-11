import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { certificates } from "@/mock/adminData";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCertificatesPage() {
	const [items, setItems] = useState([...certificates]);
	const [name, setName] = useState("");
	const [course, setCourse] = useState("");
	const [date, setDate] = useState("");
	return (
		<Layout>
			<div className="container mx-auto max-w-5xl p-6 space-y-6">
				<BackButton />
				<Card>
					<CardHeader><CardTitle>Issue Certificate</CardTitle></CardHeader>
					<CardContent className="grid md:grid-cols-3 gap-3">
						<div><Label>Learner</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
						<div><Label>Course</Label><Input value={course} onChange={(e) => setCourse(e.target.value)} /></div>
						<div><Label>Date</Label><Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM-DD" /></div>
						<div className="md:col-span-3 flex justify-end">
							<Button onClick={() => {
								if (!name || !course) return;
								setItems(prev => [{ id: Date.now(), learner: name, course, date: date || new Date().toISOString().slice(0,10), status: "Issued" }, ...prev]);
								setName(""); setCourse(""); setDate("");
							}}>Generate</Button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader><CardTitle>Certificates Generated</CardTitle></CardHeader>
					<CardContent className="space-y-2">
						{items.map(c => (
							<div key={c.id} className="p-3 border rounded flex items-center justify-between">
								<div>
									<p className="font-medium">{c.learner}</p>
									<p className="text-xs text-muted-foreground">{c.course} • {c.date}</p>
								</div>
								<Button variant="outline" onClick={() => alert("Preview certificate placeholder")}>Preview</Button>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}


