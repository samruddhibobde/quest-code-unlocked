import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function MentorStudentsPage() {
	const [students, setStudents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) { window.location.href = "/auth"; return; }

		fetch("http://localhost:5000/api/users/mentor-stats", {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => setStudents(data.topStudents || []))
			.catch(() => toast({ title: "Failed to load students", variant: "destructive" }))
			.finally(() => setLoading(false));
	}, []);

	return (
		<Layout>
			<div className="container mx-auto max-w-7xl p-6">
				<BackButton />
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">Student Management</h1>
					<p className="text-muted-foreground">View and manage your mentored students</p>
				</div>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">All Students</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{loading && <p className="text-sm text-muted-foreground">Loading students...</p>}
						{!loading && students.length === 0 && (
							<p className="text-sm text-muted-foreground">No learners registered yet.</p>
						)}
						{students.map((student: any) => (
							<div
								key={student._id}
								className="flex items-center justify-between p-4 border rounded-lg hover:border-primary cursor-pointer transition-all"
								onClick={() => setSelectedStudent(student)}
							>
								<div>
									<p className="font-medium">{student.name}</p>
									<p className="text-xs text-muted-foreground">
										Level {student.level} • {student.solvedProblems} problems solved • {student.points} XP
									</p>
								</div>
								<Badge variant="outline">
									{student.completedTutorials?.length ?? 0} tutorials
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>

				<Drawer open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudent(null)}>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>{selectedStudent?.name}</DrawerTitle>
							<DrawerDescription>
								Level {selectedStudent?.level} • {selectedStudent?.points} XP
							</DrawerDescription>
						</DrawerHeader>
						<div className="p-4 space-y-2">
							<p className="text-sm"><strong>Problems Solved:</strong> {selectedStudent?.solvedProblems}</p>
							<p className="text-sm"><strong>Tutorials Completed:</strong> {selectedStudent?.completedTutorials?.length ?? 0}</p>
							<p className="text-sm"><strong>XP Earned:</strong> {selectedStudent?.points}</p>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</Layout>
	);
}


