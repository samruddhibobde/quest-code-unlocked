import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LanguageSelect from "./pages/LanguageSelect";
import Dashboard from "./pages/Dashboard";
import Tutorials from "./pages/learner/Tutorials";
import Editor from "./pages/learner/Editor";
import Challenges from "./pages/learner/Challenges";
import Gamification from "./pages/learner/Gamification";
import Quests from "./pages/learner/Quests";
import Leaderboard from "./pages/learner/Leaderboard";
import Tracker from "./pages/learner/Tracker";
import Avatar from "./pages/learner/Avatar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Learner Routes */}
            <Route path="/learner/language" element={<LanguageSelect />} />
            <Route path="/learner/dashboard" element={<Dashboard />} />
            <Route path="/learner/tutorials" element={<Tutorials />} />
            <Route path="/learner/editor" element={<Editor />} />
            <Route path="/learner/challenges" element={<Challenges />} />
            <Route path="/learner/gamification" element={<Gamification />} />
            <Route path="/learner/quests" element={<Quests />} />
            <Route path="/learner/leaderboard" element={<Leaderboard />} />
            <Route path="/learner/tracker" element={<Tracker />} />
            <Route path="/learner/avatar" element={<Avatar />} />
            
            {/* Legacy route */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/language-select" element={<LanguageSelect />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
