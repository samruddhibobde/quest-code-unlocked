import { Layout } from "@/components/Layout"
import BackButton from "@/components/common/BackButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sword, Users, Trophy, Clock, BookOpen, Gamepad2 } from "lucide-react"
import BakeTheCodeCake from "@/components/minigames/BakeTheCodeCake"
import { storylineQuests, storyChapters } from "@/mock/storylineQuests"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import bridgeImg from "@/assets/bridge.jpg"

// Map quest visual keys to actual image imports
const visuals: Record<string, string> = {
  bridge: bridgeImg,
};

const Quests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedQuest, setSelectedQuest] = useState<typeof storylineQuests[0] | null>(null);
  const [quests, setQuests] = useState([...storylineQuests]);
  const [questProgress, setQuestProgress] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  // Fetch quest progress from backend on mount (with safe fallback)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://codequest-backend-yrse.onrender.com/api/users/quest-progress", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.quests) {
          setQuestProgress(data.quests);
          setSummary(data.summary);
        }
      })
      .catch(() => {
        // Silently fail — UI still works with empty questProgress
      });
  }, []);

  // completeQuest function (keep exactly as before)
  const completeQuest = (id: number) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
    if (id < 5) {
      setQuests(prev => prev.map(q => q.id === id + 1 ? { ...q, unlocked: true } : q));
    }
  };

  // Derive categories from questProgress
  const soloQuests = questProgress.filter(q => q.type === "solo");
  const bossQuests = questProgress.filter(q => q.type === "boss");

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quests & Adventures</h1>
          <p className="text-muted-foreground">Complete challenges and unlock rewards</p>
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

          {/* TAB 1: Storyline Quests */}
          <TabsContent value="storyline" className="space-y-4">
            {/* Progress bar */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
              <h3 className="font-bold mb-2">Digital Realm Restoration Progress</h3>
              <Progress value={(quests.filter(q => q.completed).length / quests.length) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {quests.filter(q => q.completed).length} of {quests.length} quests completed
              </p>
            </div>

            {/* Quest cards grid - EXACTLY as original */}
            <div className="grid md:grid-cols-2 gap-4">
              {quests.map((quest) => (
                <Card
                  key={quest.id}
                  className={`border-primary/20 transition-all ${
                    quest.completed ? "bg-green-500/10 border-green-500" :
                    !quest.unlocked ? "opacity-50" : "hover:border-primary cursor-pointer"
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

          {/* TAB 2: Boss Battles */}
          <TabsContent value="boss" className="space-y-4">
            {bossQuests.length === 0 ? (
              <Card className="border-destructive/20">
                <CardContent className="py-12 text-center">
                  <Sword className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-bold text-lg mb-2">Boss Battles Locked</h3>
                  <p className="text-muted-foreground text-sm">
                    Solve coding challenges to unlock boss battles!
                  </p>
                  <Button className="mt-4" onClick={() => navigate("/learner/challenges")}>
                    Go to Challenges
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bossQuests.map((quest) => (
                  <Card key={quest.id} className={`border-destructive/20 ${!quest.unlocked ? "opacity-50" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Sword className="w-5 h-5 text-destructive" />
                            {quest.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="destructive">{quest.difficulty}</Badge>
                          <span className="text-sm text-accent font-semibold">+{quest.xp} XP</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Progress value={quest.progress} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {Math.round(quest.progress)}% complete
                        </span>
                        {quest.completed ? (
                          <Badge className="bg-green-500">✓ Completed</Badge>
                        ) : quest.unlocked ? (
                          <Button size="sm" onClick={() => navigate("/learner/challenges")}>
                            Continue
                          </Button>
                        ) : (
                          <Badge variant="outline">🔒 Locked</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: Team Quests */}
          <TabsContent value="team" className="space-y-4">
            <Card className="border-primary/20">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-bold text-lg mb-2">Team Quests Coming Soon</h3>
                <p className="text-muted-foreground text-sm">
                  Collaborate with other coders to complete epic challenges together.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Mini-Games */}
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
        {/* STORYLINE QUEST MODAL */}
        <Dialog open={!!selectedQuest} onOpenChange={(o) => !o && setSelectedQuest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-2">{selectedQuest?.title}</DialogTitle>
              <DialogDescription>{selectedQuest?.story}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedQuest && (
                visuals[selectedQuest.visual] ? (
                  <img
                    src={visuals[selectedQuest.visual]}
                    alt={selectedQuest.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <span className="text-5xl mb-4 block text-center">{selectedQuest.visual}</span>
                )
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
                  const questChapters = storyChapters.filter(c => c.questId === selectedQuest.id);
                  if (questChapters.length === 0) {
                    toast({ title: "No chapters available for this quest yet." });
                    return;
                  }
                  navigate("/learner/story-editor", {
                    state: { quest: selectedQuest, chapterIndex: 0 }
                  });
                  setSelectedQuest(null);
                }}>
                  Start Challenge
                </Button>
                <Button variant="outline" onClick={() => setSelectedQuest(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Tabs>
      </div>
    </Layout>
  );
};

export default Quests;
