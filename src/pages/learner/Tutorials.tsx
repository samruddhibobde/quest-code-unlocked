import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lock, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { lessons as allLessons } from "@/mock/lessons";
import { useToast } from "@/hooks/use-toast";
import PremiumGate from "@/components/PremiumGate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Tutorials = () => {
  const { toast } = useToast();
  const [level, setLevel] = useState<string>(localStorage.getItem("codequest-level") || "beginner");
  const [openVideo, setOpenVideo] = useState<null | { title: string; src?: string }>(null);
  const [completed, setCompleted] = useState<string[]>(JSON.parse(localStorage.getItem("completedLessons") || "[]"));

  useEffect(() => {
    setLevel(localStorage.getItem("codequest-level") || "beginner");
  }, []);

  const { beginner, intermediate, advanced } = useMemo(() => {
    return {
      beginner: allLessons.filter(l => l.level === "beginner"),
      intermediate: allLessons.filter(l => l.level === "intermediate"),
      advanced: allLessons.filter(l => l.level === "advanced"),
    };
  }, []);

  const isPremium = localStorage.getItem("codequest-premium") === "true";

  const completeLesson = (title: string) => {
    const set = new Set(completed);
    set.add(title);
    const next = Array.from(set);
    setCompleted(next);
    localStorage.setItem("completedLessons", JSON.stringify(next));

    // Check automatic progression
    if (beginner.every(l => next.includes(l.title)) && level === "beginner") {
      toast({ title: "🎉 Beginner path complete! Moving to Intermediate." });
      localStorage.setItem("codequest-level", "intermediate");
      setLevel("intermediate");
      toast({ title: "You’ve unlocked Intermediate Tutorials!" });
    } else if (intermediate.every(l => next.includes(l.title)) && level === "intermediate") {
      toast({ title: "Advanced content available. Unlock Premium to continue." });
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

        {level === "beginner" && (
          <div className="grid md:grid-cols-2 gap-6">
            {beginner.map((l) => (
              <Card key={l.id} className="border-primary/20 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {l.title}
                  </CardTitle>
                  <CardDescription>{l.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary opacity-60" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setOpenVideo({ title: l.title, src: l.video })}>Play</Button>
                    <Button variant="secondary" onClick={() => completeLesson(l.title)}>Mark Complete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {level === "intermediate" && (
          <div className="grid md:grid-cols-2 gap-6">
            {intermediate.map((l) => (
              <Card key={l.id} className="border-primary/20 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle>{l.title}</CardTitle>
                  <CardDescription>{l.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary opacity-60" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setOpenVideo({ title: l.title, src: l.video })}>Play</Button>
                    <Button variant="secondary" onClick={() => completeLesson(l.title)}>Mark Complete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {level === "advanced" && (
          <PremiumGate title="Advanced Tutorials">
            <div className="grid md:grid-cols-2 gap-6">
              {advanced.map((l) => (
                <Card key={l.id} className="border-primary/20 hover:border-primary transition-all relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>{l.title}</CardTitle>
                    <CardDescription>{l.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Play className="w-10 h-10 text-primary opacity-60" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setOpenVideo({ title: l.title, src: l.video })}>Play</Button>
                      <Button variant="secondary" onClick={() => completeLesson(l.title)}>Mark Complete</Button>
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
            {/* Use the downloaded video asset if present; fallback to muted demo */}
            {openVideo?.src ? (
              <video src={openVideo.src} controls className="w-full h-full" />
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
