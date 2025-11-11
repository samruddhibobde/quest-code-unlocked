import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { tutorialUploads, type TutorialUpload } from "@/mock/tutorialUploads";

export default function UploadTutorialsPage() {
	const [items, setItems] = useState<TutorialUpload[]>([...tutorialUploads]);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [cat, setCat] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
	const [lang, setLang] = useState("JavaScript");
	const [fileName, setFileName] = useState<string>("");

	return (
		<Layout>
			<div className="container mx-auto max-w-5xl p-6 space-y-6">
				<BackButton />

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Upload Tutorial</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						<div>
							<Label>Title</Label>
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
						</div>
						<div>
							<Label>Description</Label>
							<Input value={desc} onChange={(e) => setDesc(e.target.value)} />
						</div>
						<div className="grid md:grid-cols-3 gap-3">
							<div>
								<Label>Category</Label>
								<Select value={cat} onValueChange={(v) => setCat(v as any)}>
									<SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
									<SelectContent>
										<SelectItem value="Beginner">Beginner</SelectItem>
										<SelectItem value="Intermediate">Intermediate</SelectItem>
										<SelectItem value="Advanced">Advanced</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Language</Label>
								<Input value={lang} onChange={(e) => setLang(e.target.value)} />
							</div>
							<div>
								<Label>Video</Label>
								<Input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
							</div>
						</div>
						<div className="flex justify-end">
							<Button onClick={() => {
								if (!title || !desc) return;
								const item: TutorialUpload = { id: Date.now(), title, description: desc, category: cat, language: lang, fileName, status: "Draft" };
								setItems(prev => [item, ...prev]);
								setTitle(""); setDesc(""); setFileName("");
							}}>Add</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">My Uploads</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						{items.map(it => (
							<div key={it.id} className="p-4 border rounded flex items-center justify-between">
								<div>
									<p className="font-medium">{it.title} <span className="text-xs text-muted-foreground">({it.category} • {it.language})</span></p>
									<p className="text-xs text-muted-foreground">{it.description} {it.fileName && `• ${it.fileName}`}</p>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xs rounded-full px-2 py-1 bg-secondary text-secondary-foreground">{it.status}</span>
									<Button variant="outline" onClick={() => alert("Preview placeholder")}>Preview</Button>
									<Button onClick={() => setItems(prev => prev.map(p => p.id === it.id ? { ...p, status: "Published" } : p))}>Publish</Button>
									<Button variant="destructive" onClick={() => setItems(prev => prev.filter(p => p.id !== it.id))}>Delete</Button>
								</div>
							</div>
						))}
						{items.length === 0 && <p className="text-sm text-muted-foreground">No uploads yet.</p>}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}


