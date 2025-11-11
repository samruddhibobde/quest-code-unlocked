import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";
import { feedbackSubmissions } from "@/mock/feedbackData";

export default function MentorFeedbackDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const record = useMemo(() => feedbackSubmissions.find(f => f.id === Number(id)) || feedbackSubmissions[0], [id]);
	const [category, setCategory] = useState<string>("Logic");
	const [rating, setRating] = useState<number>(3);
	const [text, setText] = useState<string>("");

	const submit = () => {
		record.comments.push({ category, rating, text, at: new Date().toISOString() });
		toast({ title: "Feedback sent to learner!" });
		setText("");
	};

	return (
		<Layout>
			<div className="container mx-auto max-w-6xl p-6">
				<div className="mb-4">
					<BackButton />
				</div>
				<div className="grid md:grid-cols-2 gap-6">
					<Card className="border-primary/20">
						<CardHeader>
							<CardTitle className="text-base">Submission by {record.studentName}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded border bg-muted p-3 overflow-auto">
								<pre className="text-xs leading-relaxed"><code>{record.codeSnippet}</code></pre>
							</div>
							<p className="text-xs text-muted-foreground mt-2">
								{record.language} • {record.level} • {record.submittedAt}
							</p>
						</CardContent>
					</Card>
					<Card className="border-primary/20">
						<CardHeader>
							<CardTitle className="text-base">Mentor Feedback</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<Label>Category</Label>
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
									<SelectContent>
										<SelectItem value="Logic">Logic</SelectItem>
										<SelectItem value="Syntax">Syntax</SelectItem>
										<SelectItem value="Optimization">Optimization</SelectItem>
										<SelectItem value="Style">Style</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Rating</Label>
								<div className="flex gap-1">
									{[1,2,3,4,5].map((i) => (
										<button key={i} onClick={() => setRating(i)} className={`p-1 ${i <= rating ? 'text-yellow-500' : 'text-muted-foreground'}`} aria-label={`Rate ${i}`}>
											★
										</button>
									))}
								</div>
							</div>
							<div>
								<Label>Detailed Feedback</Label>
								<Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write feedback..." />
							</div>
							<div className="flex gap-2">
								<Button onClick={submit} disabled={!text.trim()}>Submit</Button>
								<Button variant="secondary" onClick={() => navigate("/mentor/dashboard")}>Back</Button>
							</div>
							<div className="pt-4">
								<p className="text-sm font-medium mb-2">Previous Comments</p>
								<div className="space-y-2">
									{record.comments.length === 0 && <p className="text-xs text-muted-foreground">No comments yet.</p>}
									{record.comments.map((c, i) => (
										<div key={i} className="text-xs p-2 rounded border">
											<p className="font-medium">{c.category} • {c.rating}/5</p>
											<p>{c.text}</p>
											<p className="text-muted-foreground">{new Date(c.at).toLocaleString()}</p>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
}


