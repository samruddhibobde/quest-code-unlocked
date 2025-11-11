import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { students, sessions, mentorStats, type MentorStudent, type MentorSession } from "@/mock/mentorData";
import { StudentCard } from "./StudentCard";
import { SessionCard } from "./SessionCard";
import { Users, Star, MessageCircle, BookOpen, Gauge, CalendarDays, HelpCircle } from "lucide-react";
import { studentDoubts } from "@/mock/doubts";

function StatCard({
	title,
	value,
	icon,
}: {
	title: string;
	value: number | string;
	icon: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<span className="text-muted-foreground">{icon}</span>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}

export default function MentorDashboard() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<MentorStudent | null>(null);
	const [liveSession, setLiveSession] = useState<MentorSession | null>(null);

	const weakStudents = useMemo(() => students.filter(s => s.performance === "Weak"), []);
	const brightStudents = useMemo(() => students.filter(s => s.performance === "Bright"), []);
	const averageStudents = useMemo(() => students.filter(s => s.performance === "Average"), []);

	return (
		<div className="space-y-6">
			{/* Top actions */}
			<div className="flex flex-wrap gap-2">
				<Button variant="secondary" onClick={() => navigate("/mentor/tutorials")}>
					<BookOpen className="mr-2 h-4 w-4" /> Tutorials
				</Button>
				<Button variant="secondary" onClick={() => navigate("/mentor/students")}>
					<Users className="mr-2 h-4 w-4" /> Students
				</Button>
				<Button variant="secondary" onClick={() => navigate("/mentor/feedback/queue")}>
					<MessageCircle className="mr-2 h-4 w-4" /> Feedback Queue
				</Button>
				<Button variant="secondary" onClick={() => navigate("/mentor/sessions")}>
					<CalendarDays className="mr-2 h-4 w-4" /> Session Management
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<StatCard title="Total Students" value={mentorStats.totalStudents} icon={<Users className="h-5 w-5" />} />
				<StatCard title="Weak Students" value={mentorStats.weakStudents} icon={<Gauge className="h-5 w-5" />} />
				<StatCard title="Bright Students" value={mentorStats.brightStudents} icon={<Star className="h-5 w-5" />} />
				<StatCard title="Pending Feedbacks" value={mentorStats.pendingFeedbacks} icon={<MessageCircle className="h-5 w-5" />} />
				<StatCard title="Active Sessions" value={mentorStats.activeSessions} icon={<BookOpen className="h-5 w-5" />} />
			</div>

			{/* Main content */}
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Students Overview</TabsTrigger>
					<TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
					<TabsTrigger value="doubts">Student Doubts</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Weak Students</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-3">
								{loading ? (
									<div className="space-y-3">
										<Skeleton className="h-20 w-full" />
										<Skeleton className="h-20 w-full" />
									</div>
								) : weakStudents.length ? (
									weakStudents.map(s => (
										<StudentCard key={s.id} student={s} onClick={setSelectedStudent} />
									))
								) : (
									<p className="text-sm text-muted-foreground">No weak students right now.</p>
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Average Students</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-3">
								{loading ? (
									<div className="space-y-3">
										<Skeleton className="h-20 w-full" />
										<Skeleton className="h-20 w-full" />
									</div>
								) : averageStudents.length ? (
									averageStudents.map(s => (
										<StudentCard key={s.id} student={s} onClick={setSelectedStudent} />
									))
								) : (
									<p className="text-sm text-muted-foreground">No average students yet.</p>
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Bright Students</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-3">
								{loading ? (
									<div className="space-y-3">
										<Skeleton className="h-20 w-full" />
										<Skeleton className="h-20 w-full" />
									</div>
								) : brightStudents.length ? (
									brightStudents.map(s => (
										<StudentCard key={s.id} student={s} onClick={setSelectedStudent} />
									))
								) : (
									<p className="text-sm text-muted-foreground">No bright students yet.</p>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="sessions" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Upcoming Sessions</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							{sessions.map(sess => (
								<SessionCard
									key={sess.id}
									session={sess}
									onStart={(s) => {
										setLiveSession(s);
										toast({
											title: "Starting session",
											description: `Opening live session: ${s.title}`,
										});
									}}
								/>
							))}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="doubts" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<HelpCircle className="h-4 w-4" />
								Student Doubts / Questions
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{studentDoubts.map(d => (
								<div key={d.id} className="p-3 border rounded flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="font-medium truncate">{d.student} • {d.topic}</p>
										<p className="text-xs text-muted-foreground">{d.description}</p>
										<p className="text-xs text-muted-foreground">{d.createdAt}</p>
									</div>
									<span className="text-xs rounded-full px-2 py-1 bg-secondary text-secondary-foreground">{d.status}</span>
								</div>
							))}
							{studentDoubts.length === 0 && <p className="text-sm text-muted-foreground">No doubts raised yet.</p>}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Student Drawer */}
			<Drawer open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
				<DrawerContent className="max-h-[85vh]">
					<DrawerHeader>
						<DrawerTitle>{selectedStudent?.name}</DrawerTitle>
						<DrawerDescription>
							{selectedStudent?.level} • {selectedStudent?.language}
						</DrawerDescription>
					</DrawerHeader>
					<div className="p-4 grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-sm">Progress</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="h-40 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground">
									Mock Progress Chart
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-sm">Recent Challenges</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<ul className="list-disc pl-4 space-y-1">
									<li>Two Sum</li>
									<li>Reverse String</li>
									<li>Binary Search</li>
								</ul>
								<Button
									className="mt-3"
									onClick={() => {
										if (!selectedStudent) return;
										navigate(`/mentor/feedback/${selectedStudent.id}`);
									}}
								>
									Give Feedback
								</Button>
							</CardContent>
						</Card>
					</div>
				</DrawerContent>
			</Drawer>

			{/* Live Session Modal */}
			<Dialog open={!!liveSession} onOpenChange={(open) => !open && setLiveSession(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Live Session</DialogTitle>
						<DialogDescription>
							Placeholder for live session with {liveSession?.student}
						</DialogDescription>
					</DialogHeader>
					<div className="h-48 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground">
						Live session UI coming soon
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}


