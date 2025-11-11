import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sword, Users, Trophy, Clock } from "lucide-react";
import { mockQuests } from "@/mock/data";

const Quests = () => {
  const bossQuests = mockQuests.filter(q => q.type === 'boss');
  const teamQuests = mockQuests.filter(q => q.type === 'team');
  const soloQuests = mockQuests.filter(q => q.type === 'solo');

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quests & Hackathons</h1>
          <p className="text-muted-foreground">Join epic challenges and collaborate with others</p>
        </div>

        <Tabs defaultValue="boss" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="boss">
              <Sword className="w-4 h-4 mr-2" />
              Boss Battles
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Team Quests
            </TabsTrigger>
            <TabsTrigger value="hackathons">
              <Trophy className="w-4 h-4 mr-2" />
              Hackathons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="boss" className="space-y-4">
            {bossQuests.map((quest) => (
              <Card key={quest.id} className="border-destructive/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sword className="w-5 h-5 text-destructive" />
                        {quest.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4" />
                        {quest.timeLeft} remaining
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="destructive">{quest.difficulty}</Badge>
                      <span className="text-sm text-accent font-semibold">+{quest.xp} XP</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default">
                      Continue Battle
                    </Button>
                    <Button variant="outline">
                      Practice Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            {teamQuests.map((quest) => (
              <Card key={quest.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        {quest.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {quest.members} team members
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge>{quest.difficulty}</Badge>
                      <span className="text-sm text-accent font-semibold">+{quest.xp} XP</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Team Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default">
                      View Team
                    </Button>
                    <Button variant="outline">
                      Team Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-4">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Monthly Hackathon
                </CardTitle>
                <CardDescription>Build a full-stack application in 48 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Registration closes in:</span>
                  <Badge variant="outline">2 days 5 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prize Pool:</span>
                  <span className="text-accent font-bold">5000 coins</span>
                </div>
                <Button className="w-full" size="lg">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Quests;
