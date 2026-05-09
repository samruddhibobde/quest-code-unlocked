import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Coins, Flame, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/common/BackButton";

const Gamification = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error("Failed to load profile");
        }
        
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  // Badge definitions with conditions
  const badgeDefinitions = [
    { id: 1, name: "First Steps", description: "Complete your first tutorial", icon: "🎯", condition: (u: any) => u.completedTutorials?.length >= 1 },
    { id: 2, name: "Problem Solver", description: "Solve your first challenge", icon: "⚡", condition: (u: any) => u.solvedProblems >= 1 },
    { id: 3, name: "On A Roll", description: "Solve 5 challenges", icon: "🔥", condition: (u: any) => u.solvedProblems >= 5 },
    { id: 4, name: "Tutorial Master", description: "Complete 5 tutorials", icon: "📚", condition: (u: any) => u.completedTutorials?.length >= 5 },
    { id: 5, name: "Point Collector", description: "Earn 500 points", icon: "💰", condition: (u: any) => u.points >= 500 },
    { id: 6, name: "High Achiever", description: "Reach level 5", icon: "🏆", condition: (u: any) => u.level >= 5 },
    { id: 7, name: "Century Club", description: "Earn 1000 points", icon: "💎", condition: (u: any) => u.points >= 1000 },
    { id: 8, name: "Challenge Champion", description: "Solve 10 challenges", icon: "👑", condition: (u: any) => u.solvedProblems >= 10 },
  ];

  // Compute earned status dynamically
  const badges = badgeDefinitions.map(b => ({
    ...b,
    earned: userData ? b.condition(userData) : false
  }));

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl p-8">
          <div className="text-center py-8"><p>Loading your progress...</p></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Gamification Hub</h1>
          <p className="text-muted-foreground">Track your achievements and unlock rewards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                Coins Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{userData?.points ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Spend on power-ups and customizations</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-destructive">{userData?.solvedProblems ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Keep solving challenges to progress!</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Current Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{userData?.level ?? 1}</p>
              <p className="text-sm text-muted-foreground mt-2">Complete challenges to level up</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Badge Collection
            </CardTitle>
            <CardDescription>Earn badges by completing challenges and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-6 rounded-lg border text-center transition-all hover:scale-105 ${
                    badge.earned 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border opacity-50'
                  }`}
                >
                  <span className="text-5xl">{badge.icon}</span>
                  <h3 className="font-bold mb-2">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                  {badge.earned ? (
                    <Badge className="text-xs">
                      Earned
                    </Badge>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Keep working to unlock!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Gamification;
