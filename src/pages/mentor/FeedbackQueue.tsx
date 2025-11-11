import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { feedbackSubmissions } from "@/mock/feedbackData";
import { useNavigate } from "react-router-dom";

export default function MentorFeedbackQueuePage() {
	const navigate = useNavigate();
	return (
		<Layout>
			<div className="container mx-auto max-w-5xl p-6 space-y-6">
				<BackButton />
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Feedback Queue</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{feedbackSubmissions.map(sub => (
							<div key={sub.id} className="p-3 border rounded flex items-center justify-between">
								<div className="min-w-0">
									<p className="font-medium truncate">{sub.studentName}</p>
									<p className="text-xs text-muted-foreground">{sub.language} • {sub.level} • {sub.submittedAt}</p>
								</div>
								<Button size="sm" onClick={() => navigate(`/mentor/feedback/${sub.id}`)}>Open Feedback</Button>
							</div>
						))}
						{feedbackSubmissions.length === 0 && <p className="text-sm text-muted-foreground">No submissions in queue.</p>}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}


