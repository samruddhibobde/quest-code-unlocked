import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Lightbulb, Zap, Pause, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "react-router-dom";
import { default as MonacoEditor } from "@monaco-editor/react";
import PowersRail from "@/components/editor/PowersRail";
import BackButton from "@/components/common/BackButton";

const AUTOSAVE_KEY = "editor-autosave";

const Editor = () => {
  const location = useLocation();
  const problem = location.state?.problem || null;
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>(() => {
    const saved = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || "{}");
    if (saved.code) return saved.code;
    if (problem?.starterCode?.python) return problem.starterCode.python;
    return "# Write your code here\n\ndef solution():\n    pass";
  });
  const [results, setResults] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState<number>(() => {
    const saved = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || "{}");
    return saved.remaining ?? 900;
  });
  const [paused, setPaused] = useState(false);
  const [timeUpOpen, setTimeUpOpen] = useState(false);
  const saveRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  // Debounced autosave <= 3s
  useEffect(() => {
    if (saveRef.current) window.clearTimeout(saveRef.current);
    saveRef.current = window.setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ code, remaining: timer }));
    }, 2500);
    return () => {
      if (saveRef.current) window.clearTimeout(saveRef.current);
    };
  }, [code, timer]);

  // Timer loop
  useEffect(() => {
    if (paused) return;
    if (timer <= 0) {
      setTimeUpOpen(true);
      submitSolution(true);
      return;
    }
    tickRef.current = window.setInterval(() => setTimer((t) => t - 1), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [paused, timer]);

  // Save on tab hide/close
  useEffect(() => {
    const onVis = () => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ code, remaining: timer }));
    };
    const onBefore = () => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ code, remaining: timer }));
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", onBefore);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", onBefore);
    };
  }, [code, timer]);

  const handleRun = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please write some code before running",
        variant: "destructive",
      });
      return;
    }

    setRunning(true);
    setTimeout(() => {
      setResults({
        passed: 3,
        total: 5,
        time: '142ms',
        memory: '24MB',
        testCases: [
          { name: 'Test 1', passed: true, visible: true },
          { name: 'Test 2', passed: true, visible: true },
          { name: 'Test 3', passed: true, visible: true },
          { name: 'Test 4', passed: false, visible: false },
          { name: 'Test 5', passed: false, visible: false },
        ]
      });
      setRunning(false);
    }, 1500);
  };

  const handleSave = () => {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ code, remaining: timer }));
    toast({
      title: "Code Saved",
      description: "Your progress has been saved",
    });
  };

  const submitSolution = async (auto = false) => {
    setResults({
      passed: 4,
      total: 5,
      time: '130ms',
      memory: '22MB',
      testCases: [
        { name: 'Test 1', passed: true, visible: true },
        { name: 'Test 2', passed: true, visible: true },
        { name: 'Test 3', passed: true, visible: true },
        { name: 'Test 4', passed: true, visible: false },
        { name: 'Test 5', passed: false, visible: false },
      ]
    });
    
    // Award points on successful manual submission
    if (!auto && problem) {
      try {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/api/users/add-points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ points: problem.xp ?? 100 }),
        });
        toast({
          title: " Points Awarded!",
          description: `+${problem.xp ?? 100} XP added to your profile`,
        });
      } catch (err) {
        console.error("Failed to award points:", err);
      }
    }
    
    if (auto) {
      toast({ title: "Time's up! Auto-submitted." });
    } else {
      toast({ title: "Submitted!" });
    }
  };

  const leaveSession = () => {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ code, remaining: timer }));
    setTimeUpOpen(false);
    window.location.href = "/learner/dashboard";
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (problem?.starterCode?.[lang]) {
      setCode(problem.starterCode[lang]);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <BackButton />
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Code Editor</h1>
          <p className="text-muted-foreground">Write, test, and submit your solution</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>{problem ? problem.title : "Select a Challenge"}</CardTitle>
              <CardDescription>
                {problem && <Badge variant={
                  problem.difficulty === 'Easy' ? 'default' : 
                  problem.difficulty === 'Medium' ? 'outline' : 
                  'destructive'
                }>{problem.difficulty}</Badge>}
                {problem && <span className="ml-2 text-accent">+{problem.xp} XP</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Problem:</h3>
                <p className="text-muted-foreground">
                  {problem ? problem.description : "Go to Challenges page and select a problem to begin."}
                </p>
              </div>
              {problem?.testCases && (
                <div>
                  <h3 className="font-semibold mb-2">Test Cases:</h3>
                  {problem.testCases.slice(0, 2).map((tc: any, i: number) => (
                    <pre key={i} className="bg-muted p-3 rounded text-sm mt-2">
                      Input: {tc.input}{"\n"}Expected: {tc.expectedOutput}
                    </pre>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint
                </Button>
                <Button variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Unlock Power
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">Time Remaining: <span className="font-mono">{fmt(timer)}</span></div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Code Editor</CardTitle>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Language:</label>
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(!problem || problem.tags.includes('python')) && <SelectItem value="python">Python</SelectItem>}
                      {(!problem || problem.tags.includes('javascript')) && <SelectItem value="javascript">JavaScript</SelectItem>}
                      {(!problem || problem.tags.includes('cpp')) && <SelectItem value="cpp">C++</SelectItem>}
                      {(!problem || problem.tags.includes('java')) && <SelectItem value="java">Java</SelectItem>}
                      {(!problem || problem.tags.includes('c')) && <SelectItem value="c">C</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <MonacoEditor
                  height="350px"
                  language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "java" ? "java" : selectedLanguage === "c" ? "c" : selectedLanguage === "javascript" ? "javascript" : "python"}
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleRun} disabled={running}>
                    <Play className="w-4 h-4 mr-2" />
                    {running ? 'Running...' : 'Run Code'}
                  </Button>
                  <Button variant="outline" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="default" onClick={() => submitSolution(false)}>
                    Submit
                  </Button>
                  <Button variant="secondary" onClick={() => setPaused((p) => !p)}>
                    <Pause className="w-4 h-4 mr-2" />
                    {paused ? "Resume" : "Pause & Save"}
                  </Button>
                  <Button variant="destructive" onClick={leaveSession}>
                    <LogOut className="w-4 h-4 mr-2" /> Leave Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <PowersRail />

            {/* Results */}
            {results && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Tests Passed:</span>
                    <span className={results.passed === results.total ? 'text-success' : 'text-destructive'}>
                      {results.passed}/{results.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Execution Time:</span>
                    <span className="text-muted-foreground">{results.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Memory:</span>
                    <span className="text-muted-foreground">{results.memory}</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    {results.testCases.map((test: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-muted">
                        <span className="text-sm">{test.name}</span>
                        {test.visible ? (
                          <Badge variant={test.passed ? "default" : "destructive"}>
                            {test.passed ? '✓ Passed' : '✗ Failed'}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={timeUpOpen} onOpenChange={setTimeUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time’s up!</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>Your solution has been auto-submitted. You can review results now.</div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setTimeUpOpen(false)}>Close</Button>
              <Button onClick={leaveSession}>Leave Session</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Editor;
