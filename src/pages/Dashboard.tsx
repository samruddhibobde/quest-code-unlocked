import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Flame, Target, Star, Code2, Award, TrendingUp } from "lucide-react";
import dashboardBg from "@/assets/dashboard-bg.jpg";

const Dashboard = () => {
  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    coins: 850,
    streak: 7,
    rank: 342,
  };

  const quests = [
    { id: 1, title: "Master Python Loops", progress: 75, xp: 150, difficulty: "Medium" },
    { id: 2, title: "Defeat the Array Boss", progress: 30, xp: 300, difficulty: "Hard" },
    { id: 3, title: "Function Fundamentals", progress: 100, xp: 100, difficulty: "Easy" },
  ];

  const badges = [
    { name: "First Steps", icon: Star, earned: true },
    { name: "Week Warrior", icon: Flame, earned: true },
    { name: "Code Master", icon: Trophy, earned: false },
    { name: "Bug Hunter", icon: Target, earned: true },
  ];

  return (
    <div 
      className="min-h-screen p-8"
      style={{
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Adventurer!</h1>
          <p className="text-muted-foreground">Continue your coding quest</p>
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
              {quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="border-primary/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div 
                    key={badge.name}
                    className={`p-4 rounded-lg border ${
                      badge.earned 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border opacity-50'
                    } text-center transition-all hover:scale-105`}
                  >
                    <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.earned ? 'text-accent' : 'text-muted-foreground'}`} />
                    <p className="text-xs font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
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
