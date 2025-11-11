import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Lightbulb, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Editor = () => {
  const { toast } = useToast();
  const [code, setCode] = useState('# Write your code here\n\ndef solution():\n    pass');
  const [results, setResults] = useState<any>(null);
  const [running, setRunning] = useState(false);

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
    
    // Simulate code execution
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
    toast({
      title: "Code Saved",
      description: "Your progress has been saved",
    });
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
                  <Button variant="default">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>

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
    </Layout>
  );
};

export default Editor;
