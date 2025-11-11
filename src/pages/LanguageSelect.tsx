import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { mockLanguages } from "@/mock/data";

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const handleContinue = () => {
    if (!selectedLanguage) {
      toast({ title: "Selection Required", description: "Please choose a language", variant: "destructive" });
      return;
    }
    localStorage.setItem('codequest-language', selectedLanguage);
    toast({ title: "Language Selected!", description: `Let's begin with ${mockLanguages.find(l => l.id === selectedLanguage)?.name}!` });
    navigate("/learner/tutorials");
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-quest bg-clip-text text-transparent">Choose Your Weapon</CardTitle>
            <CardDescription className="text-lg">Select your primary programming language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {mockLanguages.map((lang) => (
                <div key={lang.id} onClick={() => setSelectedLanguage(lang.id)} className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${selectedLanguage === lang.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                  <div className="text-4xl mb-3 text-center">{lang.icon}</div>
                  <h3 className="font-bold text-lg mb-1 text-center">{lang.name}</h3>
                  <p className="text-xs text-muted-foreground text-center">{lang.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={handleContinue} size="lg" disabled={!selectedLanguage}>Continue Your Quest</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LanguageSelect;
