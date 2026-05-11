import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Play, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getTutorials, completeTutorial } from "@/services/apiClean";
import { useToast } from "@/hooks/use-toast";
import PremiumGate from "@/components/PremiumGate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const getEmbedUrl = (url: string) => {
  if (url.includes("embed")) return url;

  const videoId = url.split("v=")[1]?.split("&")[0];

  return `https://www.youtube.com/embed/${videoId}`;
};

interface Tutorial {
  _id: string;
  title: string;
  videoUrl: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
}

const TutorialsClean = () => {
  const { toast } = useToast();
  const [level, setLevel] = useState<string>(localStorage.getItem("codequest-level") || "beginner");
  const [openVideo, setOpenVideo] = useState<null | { title: string; src?: string }>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  // Auto-redirect if not logged in
  useEffect(() => {
    console.log("=== TUTORIALS PAGE AUTH CHECK ===");
    const token = localStorage.getItem("token");
    console.log("Token:", token?.substring(0, 20) + '...');
    
    if (!token) {
      console.error("No token found, redirecting to login");
      window.location.href = "/login";
      return;
    }
  }, []);

  useEffect(() => {
    setLevel(localStorage.getItem("codequest-level") || "beginner");
  }, []);

  // Fetch tutorials
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTutorials();
        console.log("Tutorials fetched:", response);
        setTutorials(response.tutorials);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tutorials';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const { beginner, intermediate, advanced } = useMemo(() => {
    const levelMap = {
      beginner: tutorials.filter(t => t.level.toLowerCase() === "beginner"),
      intermediate: tutorials.filter(t => t.level.toLowerCase() === "intermediate"),
      advanced: tutorials.filter(t => t.level.toLowerCase() === "advanced"),
    };
    return levelMap;
  }, [tutorials]);

  const isPremium = localStorage.getItem("codequest-premium") === "true";

  const isTutorialCompleted = (tutorialId: string): boolean => {
    return completedTutorials.includes(tutorialId);
  };

  const handleCompleteTutorial = async (tutorial: Tutorial) => {
    console.log("=== HANDLE COMPLETE TUTORIAL ===");
    console.log("Tutorial:", tutorial.title);
    console.log("Token:", localStorage.getItem("token")?.substring(0, 20) + '...');
    
    if (isTutorialCompleted(tutorial._id)) {
      toast({
        title: "Already Completed",
        description: "You've already completed this tutorial.",
      });
      return;
    }

    try {
      const response = await completeTutorial(tutorial._id);
      setCompletedTutorials(response.completedTutorials);
      
      toast({
        title: 'Success!',
        description: `Tutorial "${response.tutorialTitle}" marked as complete!`,
      });
      
      // Check automatic progression
      const beginnerCompleted = beginner.every(t => response.completedTutorials.includes(t._id));
      const intermediateCompleted = intermediate.every(t => response.completedTutorials.includes(t._id));
      
      if (beginnerCompleted && level === "beginner") {
        toast({ title: "Complete Beginner Path!" });
        localStorage.setItem("codequest-level", "intermediate");
        setLevel("intermediate");
        toast({ title: "Intermediate Tutorials Unlocked!" });
      } else if (intermediateCompleted && level === "intermediate") {
        toast({ title: "Advanced content available. Unlock Premium to continue." });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete tutorial';
      console.error('Tutorial completion error:', errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl p-8">
          <div className="text-center py-8">
            <p>Loading tutorials...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl p-8">
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        <div className="mb-8 mt-12">
          <h1 className="text-4xl font-bold mb-2">Tutorials & Learning Paths</h1>
          <p className="text-muted-foreground">Lessons by level. Your current level: <span className="font-medium capitalize">{level}</span></p>
        </div>

        {level === "beginner" && (
          <div className="grid md:grid-cols-2 gap-6">
            {beginner.map((tutorial) => (
              <Card key={tutorial._id} className="border-primary/20 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tutorial.title}
                    {isTutorialCompleted(tutorial._id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </CardTitle>
                  <CardDescription>{tutorial.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary opacity-60" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setOpenVideo({ title: tutorial.title, src: tutorial.videoUrl })}>Play</Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleCompleteTutorial(tutorial)}
                      disabled={isTutorialCompleted(tutorial._id)}
                    >
                      {isTutorialCompleted(tutorial._id) ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {level === "intermediate" && (
          <div className="grid md:grid-cols-2 gap-6">
            {intermediate.map((tutorial) => (
              <Card key={tutorial._id} className="border-primary/20 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tutorial.title}
                    {isTutorialCompleted(tutorial._id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </CardTitle>
                  <CardDescription>{tutorial.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary opacity-60" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setOpenVideo({ title: tutorial.title, src: tutorial.videoUrl })}>Play</Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleCompleteTutorial(tutorial)}
                      disabled={isTutorialCompleted(tutorial._id)}
                    >
                      {isTutorialCompleted(tutorial._id) ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {level === "advanced" && (
          <PremiumGate title="Advanced Tutorials">
            <div className="grid md:grid-cols-2 gap-6">
              {advanced.map((tutorial) => (
                <Card key={tutorial._id} className="border-primary/20 hover:border-primary transition-all relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {tutorial.title}
                      {isTutorialCompleted(tutorial._id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </CardTitle>
                    <CardDescription>{tutorial.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Play className="w-10 h-10 text-primary opacity-60" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setOpenVideo({ title: tutorial.title, src: tutorial.videoUrl })}>Play</Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleCompleteTutorial(tutorial)}
                        disabled={isTutorialCompleted(tutorial._id)}
                      >
                        {isTutorialCompleted(tutorial._id) ? "Completed" : "Mark Complete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PremiumGate>
        )}

        <div className="mt-6 p-4 border-t">
          <p className="text-sm font-bold text-center">
            All uploaded tutorials are protected under copyright law. Unauthorized use, reproduction, or distribution of this content will result in strict legal action and substantial financial penalties.
          </p>
        </div>
      </div>

      <Dialog open={!!openVideo} onOpenChange={(o) => !o && setOpenVideo(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{openVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full rounded bg-black overflow-hidden">
            {/* Use iframe for YouTube embed URLs */}
            {openVideo?.src ? (
              <iframe
                src={getEmbedUrl(openVideo.src)}
                width="100%"
                height="100%"
                allowFullScreen
                className="w-full h-full border-0 rounded-lg"
                title={openVideo.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No video available</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TutorialsClean;
