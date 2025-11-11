import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learner" | "mentor" | "admin">("learner");
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    localStorage.setItem('codequest-role', role);
    toast({ title: "Login Successful!", description: `Welcome back, ${role}!` });
    if (role === "learner") {
      const hasLanguage = localStorage.getItem('codequest-language');
      navigate(hasLanguage ? "/learner/dashboard" : "/learner/language");
    } else if (role === "mentor") {
      navigate("/mentor/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-quest bg-clip-text text-transparent">CodeQuest</CardTitle>
            <CardDescription>Choose your role and begin</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="learner">Learner</TabsTrigger>
                <TabsTrigger value="mentor">Mentor</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? 'border-destructive' : ''} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1"><Github className="w-4 h-4 mr-2" />GitHub</Button>
                <Button type="button" variant="outline" className="flex-1">Google</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
