import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Flame } from "lucide-react";
import { mockLeaderboard } from "@/mock/data";
import BackButton from "@/components/common/BackButton";

const Leaderboard = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-5xl p-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Compete with coders worldwide</p>
        </div>

        <Tabs defaultValue="global" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            {mockLeaderboard.map((player, index) => (
              <Card 
                key={player.rank}
                className={`border-primary/20 ${player.name === 'You' ? 'border-primary bg-primary/5' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        {player.rank <= 3 ? (
                          <Trophy className={`w-6 h-6 ${
                            player.rank === 1 ? 'text-accent' :
                            player.rank === 2 ? 'text-muted-foreground' :
                            'text-destructive'
                          }`} />
                        ) : (
                          <span className="font-bold">{player.rank}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{player.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Level {player.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-destructive" />
                            {player.streak} days
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{player.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="local">
            <Card className="border-primary/20">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Local leaderboard coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card className="border-primary/20">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Connect with friends to see their rankings</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboard;
