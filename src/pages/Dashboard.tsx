import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Zap, Flame, Target, Star, Code2, Award, TrendingUp, BookOpen, Sword, Users, Calendar, User, UsersRound } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import ChatDrawer from "@/components/chatbot/ChatDrawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supportAPI } from "@/services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
      toast({
        title: "Not logged in",
        description: "Please login again",
        variant: "destructive"
      });
      window.location.href = "/auth";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const profileRes = await fetch("https://codequest-backend-yrse.onrender.com/api/users/profile", { headers });

        if (profileRes.status === 401) {
          window.location.href = "/auth";
          return;
        }

        const profile = await profileRes.json();
        setUserData(profile);

        // Fetch rank separately so profile still loads if rank fails
        try {
          const rankRes = await fetch("https://codequest-backend-yrse.onrender.com/api/users/rank", { headers });
          const rankData = await rankRes.json();
          setRank(rankData.rank ?? 0);
        } catch {
          setRank(0);
        }

        // Fetch my support requests
        try {
          const requestsData = await supportAPI.getMyRequests();
          setMyRequests(requestsData.requests || []);
        } catch {
          setMyRequests([]);
        }

      } catch (err) {
        toast({ title: "Failed to load dashboard", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const quests = useMemo(() => [
    {
      title: "Complete 1 Tutorial",
      progress: Math.min((userData?.completedTutorials?.length ?? 0) >= 1 ? 100 : 0, 100),
      xp: 50,
      difficulty: "Easy"
    },
    {
      title: "Solve 5 Challenges",
      progress: Math.min(((userData?.solvedProblems ?? 0) / 5) * 100, 100),
      xp: 200,
      difficulty: "Medium"
    },
    {
      title: "Reach Level 5",
      progress: Math.min(((userData?.level ?? 1) / 5) * 100, 100),
      xp: 500,
      difficulty: "Hard"
    },
  ], [userData]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl p-8">
          <div className="text-center py-16"><p className="text-xl">Loading your dashboard...</p></div>
        </div>
      </Layout>
    );
  }

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
          <h1 className="text-4xl font-bold mb-2">Welcome back, {userData?.name ?? 'Adventurer'}!</h1>
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
            value={userData?.level ?? 1}
            subtitle={`${userData?.points ?? 0}/${((userData?.level ?? 1) * 100)} XP`}
            color="primary"
          />
          <StatCard 
            icon={<Trophy className="w-6 h-6" />}
            title="Coins"
            value={userData?.points ?? 0}
            subtitle="Earned"
            color="accent"
          />
          <StatCard 
            icon={<Flame className="w-6 h-6" />}
            title="Solved"
            value={userData?.solvedProblems ?? 0}
            subtitle="Keep it up!"
            color="destructive"
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="Rank"
            value={`#${rank}`}
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
            <Progress value={(( userData?.points ?? 0) / ((userData?.level ?? 1) * 100)) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {((userData?.level ?? 1) * 100) - (userData?.points ?? 0)} XP until Level {(userData?.level ?? 1) + 1}
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
              {quests.map((quest) => (
                <QuestCard key={quest.title} quest={quest} />
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
                  {myRequests.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No requests yet. Click above to request mentor support.
                    </p>
                  ) : (
                    myRequests.map((request) => (
                      <div key={request._id} className="p-3 border rounded text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{request.title}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            request.status === 'resolved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mr-2">
                            {request.category}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2 line-clamp-2">
                          {request.description}
                        </p>
                        {request.mentorResponse && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-green-800">
                            <p className="font-medium text-xs mb-1">Mentor Response:</p>
                            <p className="text-xs">{request.mentorResponse}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
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
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title of your doubt"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bug/Error">Bug/Error</SelectItem>
                <SelectItem value="Code not working">Code not working</SelectItem>
                <SelectItem value="Concept doubt">Concept doubt</SelectItem>
                <SelectItem value="Logic help">Logic help</SelectItem>
                <SelectItem value="Assignment help">Assignment help</SelectItem>
                <SelectItem value="Project guidance">Project guidance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your doubt in detail..."
              className="w-full min-h-[100px] p-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={async () => {
  if (!title || !description || !category) {
    toast({ title: "Please fill all fields" });
    return;
  }

  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("token");

    console.log("Submitting request...");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Category:", category);
    console.log("Token:", token);

    console.log("Sending request data:", { title, description, category });

    const data = await supportAPI.createRequest(title, description, category);

    console.log("Response:", data);

    toast({
      title: "Request sent successfully!",
      description: "Mentor will respond soon",
    });

    // Clear form
    setTitle("");
    setDescription("");
    setCategory("");
    setRequestOpen(false);

    // Refresh requests
    try {
      const requestsData = await supportAPI.getMyRequests();
      setMyRequests(requestsData.requests || []);
    } catch {
      setMyRequests([]);
    }

  } catch (error) {
    console.error(error);
    toast({
      title: "Failed to send request",
      description: String(error),
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}} disabled={isSubmitting}>
  {isSubmitting ? "Submitting..." : "Submit"}
</Button>
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
