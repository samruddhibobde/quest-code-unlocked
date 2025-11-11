import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Coins, Flame, Zap } from "lucide-react";
import { mockBadges } from "@/mock/data";

const Gamification = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
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
              <p className="text-4xl font-bold text-accent">850</p>
              <p className="text-sm text-muted-foreground mt-2">Spend on power-ups and customizations</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-destructive">7 days</p>
              <p className="text-sm text-muted-foreground mt-2">Keep coding to maintain your streak!</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Unlockable Powers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">3 / 12</p>
              <p className="text-sm text-muted-foreground mt-2">Special abilities to help you code</p>
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
              {mockBadges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-6 rounded-lg border text-center transition-all hover:scale-105 ${
                    badge.earned 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border opacity-50'
                  }`}
                >
                  <Award className={`w-16 h-16 mx-auto mb-4 ${badge.earned ? 'text-accent' : 'text-muted-foreground'}`} />
                  <h3 className="font-bold mb-2">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                  {badge.earned ? (
                    <Badge className="text-xs">
                      Earned {new Date(badge.earnedAt!).toLocaleDateString()}
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs">
                      How to earn?
                    </Button>
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
