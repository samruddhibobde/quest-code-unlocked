import { useEffect, useState } from "react"
import { Layout } from "@/components/Layout"
import BackButton from "@/components/common/BackButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MentorTutorialsPage() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth"; return; }

    fetch("http://localhost:5000/api/tutorials", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTutorials(data.tutorials || []))
      .catch(() => toast({ title: "Failed to load tutorials", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-6">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tutorial Management</h1>
          <p className="text-muted-foreground">View and manage all learning content</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Tutorials Library ({tutorials.length})
            </CardTitle>
            <Button variant="secondary">
              <BookOpen className="mr-2 h-4 w-4" /> Create Tutorial
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && <p className="text-sm text-muted-foreground">Loading tutorials...</p>}
            {!loading && tutorials.length === 0 && (
              <p className="text-sm text-muted-foreground">No tutorials found.</p>
            )}
            {tutorials.map((tutorial) => (
              <div key={tutorial._id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-all">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{tutorial.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {tutorial.duration} - {tutorial.level}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  tutorial.level === "Beginner" ? "default" :
                  tutorial.level === "Intermediate" ? "outline" : "destructive"
                }>
                  {tutorial.level}
                </Badge>
              </div>
            ))}
            <div className="mt-6 p-4 border-t">
              <p className="text-sm font-bold text-center">
                All uploaded tutorials are protected under copyright law.
                Unauthorized use, reproduction, or distribution of this content
                will result in strict legal action and substantial financial penalties.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


