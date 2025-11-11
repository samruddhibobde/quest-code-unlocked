import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Play } from "lucide-react";
import { mockTutorials } from "@/mock/data";
import { useNavigate } from "react-router-dom";

const Tutorials = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tutorials & Learning Paths</h1>
          <p className="text-muted-foreground">Master programming through structured lessons</p>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="docs">
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {mockTutorials.filter(t => t.type === 'video').map((tutorial) => (
                <Card key={tutorial.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary" />
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription>
                      {tutorial.duration} • {tutorial.views} views
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Play className="w-16 h-16 text-primary opacity-50" />
                    </div>
                    <Button className="w-full" onClick={() => navigate('/learner/challenges')}>
                      Start Challenge from this topic
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {mockTutorials.filter(t => t.type === 'doc').map((tutorial) => (
                <Card key={tutorial.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-secondary" />
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription>
                      Status: {tutorial.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none mb-4">
                      <p className="text-muted-foreground">
                        Comprehensive guide covering advanced topics and best practices.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read Documentation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tutorials;
