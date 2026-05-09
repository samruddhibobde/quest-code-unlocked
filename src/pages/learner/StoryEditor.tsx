import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { default as MonacoEditor } from "@monaco-editor/react";
import { ChevronRight, Lightbulb, Play, Send, Trophy } from "lucide-react";
import { storyChapters } from "@/mock/storylineQuests";

const StoryEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { quest, chapterIndex = 0 } = location.state || {};

  // Get chapters for this quest
  const chapters = storyChapters.filter(c => c.questId === quest?.id);
  const chapter = chapters[chapterIndex];

  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(chapter?.problem?.starterCode?.python || "");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  // If no quest passed, redirect
  useEffect(() => {
    if (!quest || !chapter) {
      navigate("/learner/quests");
    }
  }, [quest, chapter, navigate]);

  if (!quest || !chapter) return null;

  const isLastChapter = chapterIndex >= chapters.length - 1;
  const progressPercent = ((chapterIndex) / chapters.length) * 100;

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const starterCode = chapter.problem.starterCode[lang as keyof typeof chapter.problem.starterCode];
    if (starterCode) setCode(starterCode);
  };

  const handleRun = () => {
    if (!code.trim()) {
      toast({ title: "Write some code first!", variant: "destructive" });
      return;
    }
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      // Simulate running — show test case outputs
      const results = chapter.problem.testCases.map((tc, i) => (
        `Test ${i + 1}: Input: ${tc.input} → Expected: ${tc.expectedOutput} ✓` 
      )).join("\n");
      setOutput(results);
      setRunning(false);
    }, 1200);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({ title: "Write some code first!", variant: "destructive" });
      return;
    }

    // Award points
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/users/add-points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ points: chapter.problem.xp }),
        });
      }
    } catch (err) {
      console.error("Points award failed:", err);
    }

    setSubmitted(true);
    setSuccessOpen(true);
  };

  const handleNextChapter = () => {
    setSuccessOpen(false);
    if (isLastChapter) {
      // Quest complete — go back to quests
      toast({ title: "🎉 Quest Complete!", description: `You completed: ${quest.title}` });
      navigate("/learner/quests");
    } else {
      // Go to next chapter
      navigate("/learner/story-editor", {
        state: { quest, chapterIndex: chapterIndex + 1 }
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-6">

        {/* Top progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-primary">{quest.title}</h2>
              <p className="text-sm text-muted-foreground">{chapter.title}</p>
            </div>
            <Badge variant="outline">
              Chapter {chapterIndex + 1} / {chapters.length}
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT: Story + Problem */}
          <div className="space-y-4">

            {/* Story narrative card */}
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📖 The Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{chapter.narrative}</p>
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-sm font-bold text-destructive">{chapter.characterInDanger}</p>
                  <p className="text-sm mt-1 text-muted-foreground">{chapter.missionBrief}</p>
                </div>
              </CardContent>
            </Card>

            {/* Problem card */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    🧩 {chapter.problem.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      chapter.problem.difficulty === "Easy" ? "default" :
                      chapter.problem.difficulty === "Medium" ? "outline" : "destructive"
                    }>
                      {chapter.problem.difficulty}
                    </Badge>
                    <span className="text-sm font-bold text-accent">
                      +{chapter.problem.xp} XP
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {chapter.problem.description}
                </p>

                {/* Test cases */}
                <div>
                  <p className="text-sm font-semibold mb-2">Test Cases:</p>
                  {chapter.problem.testCases.map((tc, i) => (
                    <pre key={i} className="bg-muted p-2 rounded text-xs mt-1">
Input: {tc.input}
Expected: {tc.expectedOutput}
                    </pre>
                  ))}
                </div>

                {/* Hint toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
                {showHint && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm">💡 {chapter.problem.hint}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Code editor */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">⌨️ Your Solution</CardTitle>
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <MonacoEditor
                  height="320px"
                  language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "javascript" ? "javascript" : "python"}
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />

                <div className="flex gap-2 flex-wrap">
                  <Button onClick={handleRun} disabled={running} variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    {running ? "Running..." : "Run Code"}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitted}
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {submitted ? "Submitted ✓" : "Submit & Continue"}
                  </Button>
                </div>

                {/* Output panel */}
                {output && (
                  <div className="p-3 rounded bg-muted font-mono text-xs whitespace-pre-wrap">
                    {output}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isLastChapter ? "🏆 Quest Complete!" : "✅ Chapter Complete!"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-5xl">
              {isLastChapter ? "🎉" : "⭐"}
            </div>
            <p className="text-lg font-bold text-accent">
              +{chapter.problem.xp} XP Earned!
            </p>
            <p className="text-sm text-muted-foreground">
              {isLastChapter
                ? `You completed all chapters of "${quest.title}"! Amazing work!` 
                : `Great job! The story continues...` 
              }
            </p>
            <Button onClick={handleNextChapter} className="w-full" size="lg">
              {isLastChapter ? (
                <><Trophy className="w-4 h-4 mr-2" /> Back to Quests</>
              ) : (
                <><ChevronRight className="w-4 h-4 mr-2" /> Next Chapter</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StoryEditor;
