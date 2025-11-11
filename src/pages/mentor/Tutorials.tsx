import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function MentorTutorialsPage() {
	return (
		<Layout>
			<div className="container mx-auto max-w-7xl p-6">
				<div className="absolute top-4 left-4">
					<BackButton />
				</div>
				<div className="mt-12">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="text-base">Tutorials Library</CardTitle>
							<Button variant="secondary">
								<BookOpen className="mr-2 h-4 w-4" /> Create Tutorial
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Remember to add your watermark to the tutorial videos.
							</p>
							<div className="mt-6 p-4 border-t">
								<p className="text-sm font-bold text-center">
									All uploaded tutorials are protected under copyright law. Unauthorized use, reproduction, or distribution of this content will result in strict legal action and substantial financial penalties.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
}


