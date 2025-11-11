import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Search } from "lucide-react";
import { mockChallenges } from "@/mock/data";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { challenges as timedChallenges } from "@/mock/challenges";

const Challenges = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [timeUpOpen, setTimeUpOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [language, setLanguage] = useState('all');

  const filteredChallenges = mockChallenges.filter(c => 
    (difficulty === 'all' || c.difficulty.toLowerCase() === difficulty) &&
    (language === 'all' || c.language === language)
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

  const startChallenge = (id: number) => {
    const meta = timedChallenges.find(c => c.id === id) || timedChallenges[0];
    setActiveId(id);
    setRemaining(meta.timeLimit);
    toast({ title: "Challenge started", description: `Timer: ${Math.floor(meta.timeLimit/60)} min` });
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Coding Challenges</h1>
          <p className="text-muted-foreground">Test your skills and earn XP</p>
        </div>

        {/* Filters */}
        <Card className="border-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search challenges..." className="pl-10" />
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
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Challenge List */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
              <Card 
              key={challenge.id} 
              className="border-primary/20 hover:border-primary transition-all cursor-pointer"
              onClick={() => navigate('/learner/editor')}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {challenge.attempts} attempts • {challenge.successRate}% success rate
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={
                      challenge.difficulty === 'Easy' ? 'default' : 
                      challenge.difficulty === 'Medium' ? 'outline' : 
                      'destructive'
                    }>
                      {challenge.difficulty}
                    </Badge>
                    <span className="text-sm text-accent font-semibold">+{challenge.xp} XP</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{challenge.language}</Badge>
                  <div className="flex items-center gap-3">
                    {activeId === challenge.id && <span className="text-sm font-mono">{fmt(remaining)}</span>}
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); startChallenge(challenge.id); }}>
                      {activeId === challenge.id ? "Restart" : "Start Challenge"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
