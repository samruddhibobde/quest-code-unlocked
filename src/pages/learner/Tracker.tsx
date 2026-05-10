import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flame, Target, TrendingUp, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Tracker = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth"; return; }

    fetch("https://codequest-backend-yrse.onrender.com/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) { window.location.href = "/auth"; return; }
        return res.json();
      })
      .then(data => { if (data) setUserData(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const level = userData?.level ?? 1;
  const levelLabel = level <= 2 ? "beginner" : level <= 5 ? "intermediate" : "advanced";
  const completedTutorials = userData?.completedTutorials?.length ?? 0;
  const solvedProblems = userData?.solvedProblems ?? 0;
  const points = userData?.points ?? 0;

  const today = new Date().getDate();
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    active: i + 1 <= today,
    streak: i + 1 <= Math.min(solvedProblems + completedTutorials, today)
  }));

  // Course completion estimator
  const totalLessons = levelLabel === "beginner" ? 5 : levelLabel === "intermediate" ? 10 : 15;
  const completed = completedTutorials;
  const progress = Math.min((completed / totalLessons) * 100, 100);
  const avgDaysPerLesson = 2;
  const remainingLessons = Math.max(totalLessons - completed, 0);
  const estimatedDays = remainingLessons * avgDaysPerLesson;

  // Roadmap milestones
  const milestones = useMemo(() => [
    {
      id: 1, title: "Syntax Basics",
      completed: completedTutorials >= 1,
      progress: Math.min((completedTutorials / 1) * 100, 100)
    },
    {
      id: 2, title: "Control Flow",
      completed: completedTutorials >= 2,
      progress: Math.min((completedTutorials / 2) * 100, 100)
    },
    {
      id: 3, title: "Functions & Logic",
      completed: solvedProblems >= 1,
      progress: Math.min((solvedProblems / 1) * 100, 100)
    },
    {
      id: 4, title: "Data Structures",
      completed: solvedProblems >= 5,
      progress: Math.min((solvedProblems / 5) * 100, 100)
    },
    {
      id: 5, title: "Advanced Algorithms",
      completed: solvedProblems >= 10,
      progress: Math.min((solvedProblems / 10) * 100, 100)
    },
  ], [completedTutorials, solvedProblems]);

  const recommendation = useMemo(() => {
    if (solvedProblems === 0 && completedTutorials === 0) {
      return {
        nextChallenge: "Start with 'Two Sum' — a classic beginner array problem.",
        weakArea: "Complete your first tutorial to identify your weak areas.",
        nextChallengeRoute: "/learner/challenges",
        weakAreaRoute: "/learner/tutorials",
      };
    }
    if (completedTutorials === 0) {
      return {
        nextChallenge: "Great start on challenges! Now try a tutorial to strengthen concepts.",
        weakArea: "You haven't completed any tutorials yet — start with Beginner tutorials.",
        nextChallengeRoute: "/learner/challenges",
        weakAreaRoute: "/learner/tutorials",
      };
    }
    if (solvedProblems < 3) {
      return {
        nextChallenge: "Try 'Valid Parentheses' — a great stack problem for your level.",
        weakArea: "Practice more challenges to build problem-solving speed.",
        nextChallengeRoute: "/learner/challenges",
        weakAreaRoute: "/learner/challenges",
      };
    }
    if (solvedProblems < 7) {
      return {
        nextChallenge: "Try 'Maximum Subarray' using Kadane's algorithm.",
        weakArea: "Focus on Dynamic Programming — it appears frequently in interviews.",
        nextChallengeRoute: "/learner/challenges",
        weakAreaRoute: "/learner/quests",
      };
    }
    return {
      nextChallenge: "Challenge yourself with '0/1 Knapsack Problem' — a Hard DP problem.",
      weakArea: "Explore Graph algorithms — BFS and DFS will unlock harder problems.",
      nextChallengeRoute: "/learner/challenges",
      weakAreaRoute: "/learner/challenges",
    };
  }, [solvedProblems, completedTutorials]);

  if (loading) return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="text-center py-16">
          <p className="text-xl">Loading your progress...</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Monitor your learning journey and achievements</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{points}</p>
              <p className="text-sm text-muted-foreground mt-1">Total XP Earned</p>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{completedTutorials}</p>
              <p className="text-sm text-muted-foreground mt-1">Tutorials Completed</p>
            </CardContent>
          </Card>
          <Card className="border-destructive/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-destructive">{solvedProblems}</p>
              <p className="text-sm text-muted-foreground mt-1">Challenges Solved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Course Completion Estimator */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Course Completion Time Estimator
              </CardTitle>
              <CardDescription>Your current level: {levelLabel}</CardDescription>
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
                Problems Solved: {solvedProblems}
              </CardTitle>
              <CardDescription>Each solved challenge brings you closer to mastery!</CardDescription>
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
              <Button size="sm" className="mt-2" onClick={() => navigate(recommendation.nextChallengeRoute)}>Start Challenge</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-1">Weak Area to Focus</p>
              <p className="text-sm text-muted-foreground">{recommendation.weakArea}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate(recommendation.weakAreaRoute)}>Practice Now</Button>
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
