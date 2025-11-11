import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MentorSession } from "@/mock/mentorData";

interface SessionCardProps {
	session: MentorSession;
	onStart?: (session: MentorSession) => void;
}

export function SessionCard({ session, onStart }: SessionCardProps) {
	return (
		<Card>
			<CardContent className="p-4 flex items-center justify-between gap-4">
				<div className="min-w-0">
					<p className="font-medium truncate">{session.title}</p>
					<p className="text-xs text-muted-foreground">
						{session.student} • {session.time}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs rounded-full px-2 py-1 bg-secondary text-secondary-foreground">
						{session.status}
					</span>
					<Button size="sm" onClick={() => onStart?.(session)}>
						Start Session
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default SessionCard;


