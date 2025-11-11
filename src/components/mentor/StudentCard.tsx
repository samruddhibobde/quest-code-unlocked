import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MentorStudent } from "@/mock/mentorData";

interface StudentCardProps {
	student: MentorStudent;
	onClick?: (student: MentorStudent) => void;
}

const performanceColor: Record<MentorStudent["performance"], string> = {
	Weak: "bg-red-500/15 text-red-500",
	Bright: "bg-emerald-500/15 text-emerald-500",
	Average: "bg-amber-500/15 text-amber-500",
};

export function StudentCard({ student, onClick }: StudentCardProps) {
	return (
		<Card
			onClick={() => onClick?.(student)}
			className="cursor-pointer transition hover:border-primary/50"
		>
			<CardContent className="p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<p className="font-semibold leading-none">{student.name}</p>
						<p className="text-xs text-muted-foreground">
							{student.level} • {student.language}
						</p>
					</div>
					<Badge className={cn("rounded-full", performanceColor[student.performance])}>
						{student.performance}
					</Badge>
				</div>

				<div className="space-y-1">
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">Progress</span>
						<span className="font-medium">{student.progress}%</span>
					</div>
					<Progress value={student.progress} />
				</div>

				<p className="text-xs text-muted-foreground">Last active: {student.lastActive}</p>
			</CardContent>
		</Card>
	);
}

export default StudentCard;


