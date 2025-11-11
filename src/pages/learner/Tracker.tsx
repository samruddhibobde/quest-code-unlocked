import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flame, Target, TrendingUp, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recommendNext } from "@/mock/recommendations";

const Tracker = () => {
  const level = localStorage.getItem("codequest-level") || "beginner";
  const completedLessons = JSON.parse(localStorage.getItem("completedLessons") || "[]");
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.4,
    streak: Math.random() > 0.6
  }));

  // Course completion estimator
  const totalLessons = level === "beginner" ? 5 : level === "intermediate" ? 10 : 15;
  const completed = completedLessons.length;
  const progress = (completed / totalLessons) * 100;
  const avgDaysPerLesson = 2;
  const remainingLessons = totalLessons - completed;
  const estimatedDays = remainingLessons * avgDaysPerLesson;

  // Roadmap milestones
  const milestones = [
    { id: 1, title: "Syntax Basics", completed: completed >= 1, progress: Math.min(100, (completed / 1) * 100) },
    { id: 2, title: "Control Flow", completed: completed >= 2, progress: Math.min(100, (completed / 2) * 100) },
    { id: 3, title: "Functions", completed: completed >= 3, progress: Math.min(100, (completed / 3) * 100) },
    { id: 4, title: "Data Structures", completed: completed >= 4, progress: Math.min(100, (completed / 4) * 100) },
    { id: 5, title: "OOP Concepts", completed: completed >= 5, progress: Math.min(100, (completed / 5) * 100) },
  ];

  const recommendation = recommendNext();

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        <div className="mb-8 mt-12">
          <h1 className="text-4xl font-bold mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Track your learning journey and completion time</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Course Completion Estimator */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Course Completion Time Estimator
              </CardTitle>
              <CardDescription>Your current level: {level}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{completed}/{totalLessons} lessons</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Estimated Completion</p>
                <p className="text-2xl font-bold text-primary">{estimatedDays} days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on {avgDaysPerLesson} days per lesson
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                Current Streak: 7 days
              </CardTitle>
              <CardDescription>Keep coding every day to maintain your streak!</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Roadmap */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Learning Roadmap
            </CardTitle>
            <CardDescription>Predict number of days to complete each milestone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {m.completed ? (
                      <Badge className="bg-green-500">✓</Badge>
                    ) : (
                      <Badge variant="outline">{m.id}</Badge>
                    )}
                    <span className="font-medium">{m.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {m.completed ? "Completed" : `~${(5 - m.id + 1) * avgDaysPerLesson} days`}
                  </span>
                </div>
                <Progress value={m.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Adaptive Recommendations */}
        <Card className="mt-6 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Adaptive learning suggestions based on your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-1">Recommended Next Challenge</p>
              <p className="text-sm text-muted-foreground">{recommendation.nextChallenge}</p>
              <Button size="sm" className="mt-2">Start Challenge</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-1">Weak Area to Focus</p>
              <p className="text-sm text-muted-foreground">{recommendation.weakArea}</p>
              <Button size="sm" variant="outline" className="mt-2">Practice Now</Button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <div 
                  key={day.day}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-medium ${
                    day.streak 
                      ? 'bg-destructive text-destructive-foreground' 
                      : day.active 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {day.day}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive" />
                <span>Streak day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20" />
                <span>Active day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted" />
                <span>Inactive</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Tracker;
