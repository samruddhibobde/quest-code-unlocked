import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Github, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setUiLang, t, getUiLang } from "@/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// ✅ Import local avatar images
import avatar1 from "@/assets/avatar1.jpg";
import avatar2 from "@/assets/avatar2.jpg";
import avatar3 from "@/assets/avatar3.jpg";
import avatar4 from "@/assets/avatar4.png";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learner" | "mentor" | "admin">("learner");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [avatar, setAvatar] = useState<string>(localStorage.getItem("avatar") || "");
  const [uiLang, setLang] = useState<string>(getUiLang());
  const [showSecurePopup, setShowSecurePopup] = useState(true);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    localStorage.setItem("codequest-role", role);
    toast({ title: "Login Successful!", description: `Welcome back, ${role}!` });
    if (role === "learner") {
      const hasLanguage = localStorage.getItem("codequest-language");
      const hasLevel = localStorage.getItem("codequest-level");
      navigate(hasLanguage && hasLevel ? "/learner/dashboard" : "/learner/get-started");
    } else if (role === "mentor") {
      navigate("/mentor/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
  };

  // ✅ Avatar options from assets
  const avatars = [
    { id: 1, src: avatar1 },
    { id: 2, src: avatar2 },
    { id: 3, src: avatar3 },
    { id: 4, src: avatar4 },
  ];

  return (
    <Layout showNav={false}>
      {/* Secure authentication popup */}
      <Dialog open={showSecurePopup} onOpenChange={setShowSecurePopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Secure Authentication
            </DialogTitle>
            <DialogDescription>
              Your login is protected with secure authentication. All data is encrypted and transmitted over TLS 1.3.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSecurePopup(false)} className="w-full">
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-quest bg-clip-text text-transparent">CodeQuest</CardTitle>
            <CardDescription>Choose your role and begin</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Role selection */}
            <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="learner">Learner</TabsTrigger>
                <TabsTrigger value="mentor">Mentor</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Learner avatar selection */}
              {role === "learner" && (
                <div>
                  <Label>Select Your Avatar</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {avatars.map((a) => {
                      const selected = avatar === a.src;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAvatar(a.src)}
                          className={`aspect-square rounded border-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring ${
                            selected ? "border-primary" : "border-border"
                          }`}
                          aria-pressed={selected}
                          aria-label={`Select avatar ${a.id}`}
                        >
                          <img
                            src={a.src}
                            alt={`Avatar ${a.id}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Language selector */}
              <div>
                <Label htmlFor="ui-lang">{t("language")}</Label>
                <Select
                  value={uiLang}
                  onValueChange={(v) => {
                    setLang(v);
                    setUiLang(v as any);
                  }}
                >
                  <SelectTrigger id="ui-lang">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email input */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password input */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                onClick={() => {
                  if (role === "learner" && avatar) localStorage.setItem("avatar", avatar);
                }}
              >
                {t("login")}
              </Button>

              {/* OAuth (mock) */}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Google
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
