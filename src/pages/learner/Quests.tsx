import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sword, Users, Trophy, Clock, BookOpen, Gamepad2 } from "lucide-react";
import BakeTheCodeCake from "@/components/minigames/BakeTheCodeCake";
import { mockQuests } from "@/mock/data";
import { storylineQuests } from "@/mock/storylineQuests";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import bridgeImg from "@/assets/bridge.jpg";

// Map quest visual keys to actual image imports
const visuals: Record<string, string> = {
  bridge: bridgeImg,
};

const Quests = () => {
  const navigate = useNavigate();
  const [selectedQuest, setSelectedQuest] = useState<typeof storylineQuests[0] | null>(null);
  const bossQuests = mockQuests.filter(q => q.type === 'boss');
  const teamQuests = mockQuests.filter(q => q.type === 'team');
  const soloQuests = mockQuests.filter(q => q.type === 'solo');
  const [quests, setQuests] = useState([...storylineQuests]);

  const completeQuest = (id: number) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
    if (id < 5) {
      setQuests(prev => prev.map(q => q.id === id + 1 ? { ...q, unlocked: true } : q));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        <div className="mb-8 mt-12">
          <h1 className="text-4xl font-bold mb-2">Quests & Hackathons</h1>
          <p className="text-muted-foreground">Join epic challenges and collaborate with others</p>
        </div>

        <Tabs defaultValue="storyline" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="storyline">
              <BookOpen className="w-4 h-4 mr-2" />
              Storyline Quests
            </TabsTrigger>
            <TabsTrigger value="boss">
              <Sword className="w-4 h-4 mr-2" />
              Boss Battles
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Team Quests
            </TabsTrigger>
            <TabsTrigger value="minigames">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Mini-Games
            </TabsTrigger>
            <TabsTrigger value="hackathons">
              <Trophy className="w-4 h-4 mr-2" />
              Hackathons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="storyline" className="space-y-4">
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
              <h3 className="font-bold mb-2">Digital Realm Restoration Progress</h3>
              <Progress value={(quests.filter(q => q.completed).length / quests.length) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {quests.filter(q => q.completed).length} of {quests.length} quests completed
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {quests.map((quest) => (
                <Card 
                  key={quest.id} 
                  className={`border-primary/20 transition-all ${
                    quest.completed ? 'bg-green-500/10 border-green-500' : 
                    !quest.unlocked ? 'opacity-50' : 'hover:border-primary cursor-pointer'
                  }`}
                  onClick={() => quest.unlocked && setSelectedQuest(quest)}
                >
                  <CardHeader>
                    <div className="space-y-3">
                      {visuals[quest.visual] ? (
                        <img 
                          src={visuals[quest.visual]} 
                          alt={quest.title} 
                          className="w-full h-64 object-cover rounded-lg" 
                        />
                      ) : (
                        <span className="text-5xl block text-center">{quest.visual}</span>
                      )}
                      <div className="flex items-center justify-between">
                        <CardTitle>{quest.title}</CardTitle>
                        {quest.completed && <Badge className="bg-green-500">✓ Completed</Badge>}
                        {!quest.unlocked && <Badge variant="outline">Locked</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{quest.story}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

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

          <TabsContent value="minigames" className="space-y-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Interactive Mini-Games</h3>
              <p className="text-sm text-muted-foreground">
                Learn coding concepts through fun, interactive games!
              </p>
            </div>
            <BakeTheCodeCake />
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

        {/* Storyline Quest Modal */}
        <Dialog open={!!selectedQuest} onOpenChange={(o) => !o && setSelectedQuest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-2">
                {selectedQuest?.title}
              </DialogTitle>
              <DialogDescription>{selectedQuest?.story}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedQuest && (
                <>
                  {visuals[selectedQuest.visual] ? (
                    <img 
                      src={visuals[selectedQuest.visual]} 
                      alt={selectedQuest.title} 
                      className="w-full h-64 object-cover rounded-lg mb-4" 
                    />
                  ) : (
                    <span className="text-5xl mb-4 block text-center">{selectedQuest.visual}</span>
                  )}
                </>
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedQuest?.challenge}</p>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button onClick={() => {
                  navigate('/learner/editor');
                  setSelectedQuest(null);
                }}>Start Challenge</Button>
                <Button variant="outline" onClick={() => setSelectedQuest(null)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Quests;
