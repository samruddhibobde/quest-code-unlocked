import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { students } from "@/mock/mentorData";
import { StudentCard } from "@/components/mentor/StudentCard";
import { useState } from "react";
import type { MentorStudent } from "@/mock/mentorData";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MentorStudentsPage() {
	const [selectedStudent, setSelectedStudent] = useState<MentorStudent | null>(null);
	const navigate = useNavigate();

	return (
		<Layout>
			<div className="container mx-auto max-w-7xl p-6">
				<div className="mb-4">
					<BackButton />
				</div>
				<Card>
				<CardHeader>
					<CardTitle className="text-base">All Students</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3 md:grid-cols-2">
					{students.map(s => (
						<StudentCard key={s.id} student={s} onClick={setSelectedStudent} />
					))}
				</CardContent>
			</Card>

			<Drawer open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudent(null)}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{selectedStudent?.name}</DrawerTitle>
						<DrawerDescription>
							{selectedStudent?.level} • {selectedStudent?.language}
						</DrawerDescription>
					</DrawerHeader>
					<div className="p-4">
						<Button onClick={() => selectedStudent && navigate(`/mentor/feedback/${selectedStudent.id}`)}>
							Give Feedback
						</Button>
					</div>
				</DrawerContent>
			</Drawer>
			</div>
		</Layout>
	);
}


