import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

const languages = [
  { 
    name: "Python", 
    icon: "🐍", 
    description: "Beginner-friendly, versatile for AI & web",
    color: "from-yellow-600 to-blue-600"
  },
  { 
    name: "JavaScript", 
    icon: "⚡", 
    description: "Power the web with dynamic interfaces",
    color: "from-yellow-400 to-yellow-600"
  },
  { 
    name: "Java", 
    icon: "☕", 
    description: "Enterprise-grade, cross-platform power",
    color: "from-orange-600 to-red-600"
  },
  { 
    name: "C++", 
    icon: "⚙️", 
    description: "High-performance system programming",
    color: "from-blue-600 to-purple-600"
  },
  { 
    name: "C", 
    icon: "🔧", 
    description: "Foundation of modern computing",
    color: "from-gray-600 to-blue-600"
  },
];

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageSelect = (language: string) => {
    toast({
      title: `${language} Quest Selected!`,
      description: "Preparing your learning path...",
    });
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen p-8"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      
      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-quest bg-clip-text text-transparent">
            Choose Your Path
          </h1>
          <p className="text-xl text-muted-foreground">
            Select a programming language to begin your quest
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, index) => (
            <Card 
              key={lang.name}
              className="group hover:border-primary transition-all hover:shadow-glow-primary cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleLanguageSelect(lang.name)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {lang.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{lang.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {lang.description}
                </p>
                <div className={`h-1 rounded-full bg-gradient-to-r ${lang.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
