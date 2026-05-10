import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/common/BackButton";

const Challenges = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [timeUpOpen, setTimeUpOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [language, setLanguage] = useState('all');

  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://codequest-backend-yrse.onrender.com/api/problems", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch problems");
        }
        
        const data = await res.json();
        setProblems(data.problems);
      } catch (error) {
        toast({
          title: "Failed to load problems",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [toast]);

  // Filter problems based on all criteria
  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (difficulty === 'all' || problem.difficulty.toLowerCase() === difficulty) &&
    (language === 'all' || problem.tags.includes(language))
  );

  useEffect(() => {
    if (activeId == null) return;
    if (remaining <= 0 && activeId != null) {
      setTimeUpOpen(true);
      setActiveId(null);
      if (timerRef.current) window.clearInterval(timerRef.current);
      toast({ title: "Time’s up! Your solution has been submitted." });
      return;
    }
    timerRef.current = window.setInterval(() => setRemaining((s) => s - 1));
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [activeId, remaining, toast]);

  const startChallenge = (id: string) => {
    setActiveId(id);
    setRemaining(1800); // 30 minutes in seconds
    toast({ title: "Challenge started", description: "Timer: 30 min" });
    const problem = problems.find(p => p._id === id);
    navigate("/learner/editor", { state: { problem } });
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <BackButton />
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Coding Challenges</h1>
          <p className="text-muted-foreground">Test your skills and earn XP</p>
        </div>

        {/* Filters */}
        <Card className="border-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search challenges..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Challenge List */}
        {loading ? (
          <div className="text-center py-8"><p>Loading challenges...</p></div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((problem) => (
              <Card 
                key={problem._id} 
                className="border-primary/20 hover:border-primary transition-all cursor-pointer"
                onClick={() => navigate("/learner/editor", { state: { problem } })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        {problem.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {problem.attempts} attempts · {problem.successRate}% success rate
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        problem.difficulty === 'Easy' ? 'default' : 
                        problem.difficulty === 'Medium' ? 'outline' : 
                        'destructive'
                      }>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-sm text-accent font-semibold">+{problem.xp} XP</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {problem.tags.map((tag: string) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className={
                            tag === 'python' ? 'bg-blue-500 text-white' :
                            tag === 'javascript' ? 'bg-yellow-500 text-black' :
                            tag === 'cpp' ? 'bg-purple-500 text-white' :
                            tag === 'java' ? 'bg-orange-500 text-white' :
                            tag === 'c' ? 'bg-green-500 text-white' : ''
                          }
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      {activeId === problem._id && <span className="text-sm font-mono">{fmt(remaining)}</span>}
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); startChallenge(problem._id); }}>
                        {activeId === problem._id ? "Restart" : "Start Challenge"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={timeUpOpen} onOpenChange={setTimeUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time’s up!</DialogTitle>
          </DialogHeader>
          <div className="text-sm">Your solution has been auto-submitted. Check results in the editor.</div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Challenges;
