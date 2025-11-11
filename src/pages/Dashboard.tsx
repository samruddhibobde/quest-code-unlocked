import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Flame, Target, Star, Code2, Award, TrendingUp, BookOpen, Sword, Users, Calendar, User, UsersRound } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { mockQuests, mockBadges } from "@/mock/data";
import ChatDrawer from "@/components/chatbot/ChatDrawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mentorRequests } from "@/mock/mentorRequests";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [topic, setTopic] = useState<string>("");
  
  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    coins: 850,
    streak: 7,
    rank: 342,
  };

  const quickLinks = [
    { icon: BookOpen, label: 'Tutorials', path: '/learner/tutorials', color: 'text-primary' },
    { icon: Code2, label: 'Editor', path: '/learner/editor', color: 'text-secondary' },
    { icon: Sword, label: 'Challenges', path: '/learner/challenges', color: 'text-destructive' },
    { icon: Trophy, label: 'Gamification', path: '/learner/gamification', color: 'text-accent' },
    { icon: Target, label: 'Quests', path: '/learner/quests', color: 'text-primary' },
    { icon: Users, label: 'Leaderboard', path: '/learner/leaderboard', color: 'text-secondary' },
    { icon: Calendar, label: 'Tracker', path: '/learner/tracker', color: 'text-success' },
    { icon: User, label: 'Avatar', path: '/learner/avatar', color: 'text-accent' },
  ];

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8 relative">
        <div className="absolute top-4 left-4">
          {/* Back button to get-started for quick access */}
          <Button variant="link" onClick={() => navigate('/learner/get-started')}>← Back</Button>
        </div>
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Adventurer!</h1>
          <p className="text-muted-foreground">Continue your coding quest</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {quickLinks.map((link) => (
            <Card 
              key={link.path}
              className="border-primary/20 hover:border-primary cursor-pointer transition-all hover:scale-105"
              onClick={() => navigate(link.path)}
            >
              <CardContent className="p-6 text-center">
                <link.icon className={`w-8 h-8 mx-auto mb-2 ${link.color}`} />
                <p className="font-medium">{link.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Zap className="w-6 h-6" />}
            title="Level"
            value={userStats.level}
            subtitle={`${userStats.xp}/${userStats.xpToNext} XP`}
            color="primary"
          />
          <StatCard 
            icon={<Trophy className="w-6 h-6" />}
            title="Coins"
            value={userStats.coins}
            subtitle="Earned"
            color="accent"
          />
          <StatCard 
            icon={<Flame className="w-6 h-6" />}
            title="Streak"
            value={`${userStats.streak} days`}
            subtitle="Keep it up!"
            color="destructive"
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="Rank"
            value={`#${userStats.rank}`}
            subtitle="Global"
            color="secondary"
          />
        </div>

        {/* XP Progress */}
        <Card className="mb-8 border-primary/20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {userStats.xpToNext - userStats.xp} XP until Level {userStats.level + 1}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Quests */}
          <Card className="lg:col-span-2 border-primary/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Active Quests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockQuests.slice(0, 3).map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </CardContent>
          </Card>

          {/* Connect with Mentor (Dedicated Section) */}
          <Card className="border-primary/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="w-5 h-5" />
                Need Help? Connect with a Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Request personalized support or schedule a live session.</p>
              <div className="flex justify-between items-center">
                <Button onClick={() => setRequestOpen(true)}>Request Mentor Support</Button>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">My Mentor Requests</p>
                <div className="space-y-2">
                  {mentorRequests.length === 0 && <p className="text-xs text-muted-foreground">No requests yet.</p>}
                  {mentorRequests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-sm p-2 border rounded">
                      <span>{r.topic}</span>
                      <span className="text-xs rounded-full px-2 py-0.5 bg-secondary text-secondary-foreground">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    <ChatDrawer />

    {/* Mentor Request Modal */}
    <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Mentor Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Topic / Problem Area</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="loops">Loops</SelectItem>
              <SelectItem value="arrays">Arrays</SelectItem>
              <SelectItem value="recursion">Recursion</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end">
            <Button onClick={() => {
              if (!topic) return;
              mentorRequests.push({ id: Date.now(), student: "You", topic, status: "Pending" });
              toast({ title: "Mentor request sent!" });
              setRequestOpen(false);
            }}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </Layout>
  );
};

const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  subtitle: string;
  color: string;
}) => {
  const colorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    destructive: 'text-destructive',
    secondary: 'text-secondary',
  };

  return (
    <Card className="border-primary/20 hover:border-primary transition-all hover:shadow-glow-primary animate-slide-up">
      <CardContent className="p-6">
        <div className={`${colorClasses[color as keyof typeof colorClasses]} mb-2`}>{icon}</div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

const QuestCard = ({ quest }: { quest: any }) => {
  const difficultyColors = {
    Easy: 'success',
    Medium: 'accent',
    Hard: 'destructive',
  };

  return (
    <div className="p-4 rounded-lg border border-border hover:border-primary transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
            {quest.title}
          </h4>
          <Badge variant="outline" className={`text-${difficultyColors[quest.difficulty as keyof typeof difficultyColors]}`}>
            {quest.difficulty}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-accent">+{quest.xp} XP</p>
        </div>
      </div>
      <div className="space-y-2">
        <Progress value={quest.progress} className="h-2" />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">{quest.progress}% Complete</p>
          {quest.progress === 100 ? (
            <Badge variant="outline" className="text-success">
              ✓ Complete
            </Badge>
          ) : (
            <Button size="sm" variant="ghost">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
