import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lock, Play, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { useTutorials } from "@/hooks/useTutorials";
import { useToast } from "@/hooks/use-toast";
import PremiumGate from "@/components/PremiumGate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tutorial } from "@/services/api";

const getEmbedUrl = (url: string) => {
  if (url.includes("embed")) return url;

  const videoId = url.split("v=")[1]?.split("&")[0];

  return `https://www.youtube.com/embed/${videoId}`;
};

const Tutorials = () => {
  const { toast } = useToast();
  const [level, setLevel] = useState<string>(localStorage.getItem("codequest-level") || "beginner");
  const [openVideo, setOpenVideo] = useState<null | { title: string; src?: string }>(null);
  
  const { 
    tutorials, 
    loading, 
    error, 
    completedTutorials, 
    completeTutorial, 
    isTutorialCompleted 
  } = useTutorials();

  useEffect(() => {
    setLevel(localStorage.getItem("codequest-level") || "beginner");
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

  const handleCompleteTutorial = async (tutorial: Tutorial) => {
    if (isTutorialCompleted(tutorial._id)) {
      toast({
        title: "Already Completed",
        description: "You've already completed this tutorial.",
      });
      return;
    }

    try {
      await completeTutorial(tutorial._id);
      
      // Build local updatedCompleted array right after completeTutorial
      const updatedCompleted = [...completedTutorials, tutorial._id];
      
      // Use updatedCompleted for progression checks
      const beginnerCompleted = beginner.every(t => updatedCompleted.includes(t._id));
      const intermediateCompleted = intermediate.every(t => updatedCompleted.includes(t._id));
      
      if (beginnerCompleted && level === "beginner") {
        toast({ title: "Beginner path complete! Moving to Intermediate." });
        localStorage.setItem("codequest-level", "intermediate");
        setLevel("intermediate");
        toast({ title: "You've unlocked Intermediate Tutorials!" });
      } else if (intermediateCompleted && level === "intermediate") {
        toast({ title: "Advanced content available. Unlock Premium to continue." });
      }
    } catch (error) {
      // Error is already handled in the hook
    }
  };

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

        {loading && (
          <div className="text-center py-8">
            <p>Loading tutorials...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
          </div>
        )}

        {!loading && !error && level === "beginner" && (
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
                      className="flex items-center gap-2"
                    >
                      {isTutorialCompleted(tutorial._id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Completed
                        </>
                      ) : (
                        "Mark Complete"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && level === "intermediate" && (
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
                      className="flex items-center gap-2"
                    >
                      {isTutorialCompleted(tutorial._id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Completed
                        </>
                      ) : (
                        "Mark Complete"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && level === "advanced" && (
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
                        className="flex items-center gap-2"
                      >
                        {isTutorialCompleted(tutorial._id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Completed
                          </>
                        ) : (
                          "Mark Complete"
                        )}
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

export default Tutorials;
