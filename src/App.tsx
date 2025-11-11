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
import GetStarted from "./pages/learner/GetStarted";
import Editor from "./pages/learner/Editor";
import Challenges from "./pages/learner/Challenges";
import Gamification from "./pages/learner/Gamification";
import Quests from "./pages/learner/Quests";
import Leaderboard from "./pages/learner/Leaderboard";
import Tracker from "./pages/learner/Tracker";
import Avatar from "./pages/learner/Avatar";
import NotFound from "./pages/NotFound";
import LevelPrompt from "./components/learner/LevelPrompt";
import MentorDashboardPage from "./pages/mentor/Dashboard";
import MentorStudentsPage from "./pages/mentor/Students";
import MentorTutorialsPage from "./pages/mentor/Tutorials";
import MentorFeedbackDetailPage from "./pages/mentor/FeedbackDetail";
import MentorFeedbackQueuePage from "./pages/mentor/FeedbackQueue";
import MentorSessionsPage from "./pages/mentor/Sessions";
import UploadTutorialsPage from "./pages/mentor/UploadTutorials";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminModerationPage from "./pages/admin/Moderation";
import AdminPaymentsPage from "./pages/admin/Payments";
import AdminCertificatesPage from "./pages/admin/Certificates";
import AdminUsersPage from "./pages/admin/Users";

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
            
            <Route path="/level-prompt" element={<Index />} />
            
            {/* Learner Routes */}
            <Route path="/learner/language" element={<LanguageSelect />} />
            <Route path="/learner/get-started" element={<GetStarted />} />
            <Route path="/learner/dashboard" element={<Dashboard />} />
            <Route path="/learner/tutorials" element={<Tutorials />} />
            <Route path="/learner/editor" element={<Editor />} />
            <Route path="/learner/challenges" element={<Challenges />} />
            <Route path="/learner/gamification" element={<Gamification />} />
            <Route path="/learner/quests" element={<Quests />} />
            <Route path="/learner/leaderboard" element={<Leaderboard />} />
            <Route path="/learner/tracker" element={<Tracker />} />
            <Route path="/learner/avatar" element={<Avatar />} />
            
            {/* Mentor Routes */}
            <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
            <Route path="/mentor/students" element={<MentorStudentsPage />} />
            <Route path="/mentor/tutorials" element={<MentorTutorialsPage />} />
            <Route path="/mentor/tutorials/upload" element={<UploadTutorialsPage />} />
            <Route path="/mentor/sessions" element={<MentorSessionsPage />} />
            <Route path="/mentor/feedback/:id" element={<MentorFeedbackDetailPage />} />
            <Route path="/mentor/feedback/queue" element={<MentorFeedbackQueuePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/moderation" element={<AdminModerationPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            
            {/* Legacy route */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/language-select" element={<LanguageSelect />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <LevelPrompt />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
