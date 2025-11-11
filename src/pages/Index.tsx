import { Button } from "@/components/ui/button";
import { Code2, Zap, Trophy, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-quest bg-clip-text text-transparent animate-glow">
              CodeQuest
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Embark on an epic journey through the digital realm. Learn to code, complete quests, defeat boss battles, and become a legendary developer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group">
                  Start Your Quest
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-4 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FeatureCard 
              icon={<Code2 className="w-8 h-8" />}
              title="Learn by Doing"
              description="Master 5 languages through interactive challenges"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Level Up"
              description="Earn XP, unlock badges, and climb the ranks"
            />
            <FeatureCard 
              icon={<Trophy className="w-8 h-8" />}
              title="Boss Battles"
              description="Test your skills in epic timed challenges"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Team Quests"
              description="Collaborate and compete with others"
            />
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover:shadow-glow-primary group">
      <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
