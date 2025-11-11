import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flame } from "lucide-react";

const Tracker = () => {
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.4,
    streak: Math.random() > 0.6
  }));

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Daily Coding Tracker</h1>
          <p className="text-muted-foreground">Maintain your coding streak</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                Current Streak: 7 days
              </CardTitle>
              <CardDescription>Keep coding every day to maintain your streak!</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
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

          <Card className="border-primary/20 bg-gradient-cosmic">
            <CardContent className="p-6 text-center">
              <p className="text-lg font-medium italic">
                "The expert in anything was once a beginner who never gave up."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Tracker;
