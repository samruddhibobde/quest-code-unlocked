import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Lightbulb, Zap, Pause, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PowersRail from "@/components/editor/PowersRail";

const AUTOSAVE_KEY = "editor-autosave";

const Editor = () => {
  const { toast } = useToast();
  const [code, setCode] = useState<string>(() => {
    const saved = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || "{}");
    return saved.code ?? '# Write your code here\n\ndef solution():\n    pass';
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

  const submitSolution = (auto = false) => {
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
    if (auto) {
      toast({ title: "Time’s up! Auto-submitted." });
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

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Code Editor</h1>
          <p className="text-muted-foreground">Write, test, and submit your solution</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Two Sum Problem</CardTitle>
              <CardDescription>
                <Badge>Easy</Badge>
                <span className="ml-2 text-accent">+100 XP</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Problem:</h3>
                <p className="text-muted-foreground">
                  Given an array of integers and a target value, return indices of the two numbers that add up to the target.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Example:</h3>
                <pre className="bg-muted p-3 rounded text-sm">
                  Input: nums = [2,7,11,15], target = 9{'\n'}
                  Output: [0,1]
                </pre>
              </div>
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
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono min-h-[300px] resize-none"
                  placeholder="Write your code here..."
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
