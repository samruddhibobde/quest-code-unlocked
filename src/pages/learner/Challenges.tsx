import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Search } from "lucide-react";
import { mockChallenges } from "@/mock/data";
import { useNavigate } from "react-router-dom";

const Challenges = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('all');
  const [language, setLanguage] = useState('all');

  const filteredChallenges = mockChallenges.filter(c => 
    (difficulty === 'all' || c.difficulty.toLowerCase() === difficulty) &&
    (language === 'all' || c.language === language)
  );

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
                  <Button variant="ghost" size="sm">
                    Solve Challenge →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Challenges;
