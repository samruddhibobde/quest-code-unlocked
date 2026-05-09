import { useState, useEffect } from 'react';
import { tutorialAPI, Tutorial } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useTutorials = () => {
  const { toast } = useToast();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchTutorials();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCompletedTutorials(data.completedTutorials || []);
        console.log("Loaded completed tutorials:", data.completedTutorials);
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tutorialAPI.getTutorials();
      setTutorials(response.tutorials);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tutorials';
      console.error('Fetch tutorials error:', errorMessage);
      setError(errorMessage);
      
      // Only show toast for non-auth errors
      if (!errorMessage.includes('401') && !errorMessage.includes('Unauthorized')) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const completeTutorial = async (tutorialId: string) => {
    console.log("=== COMPLETE TUTORIAL DEBUG ===");
    console.log("Tutorial ID:", tutorialId);
    console.log("Token from localStorage:", localStorage.getItem("token"));
    
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      throw new Error("No token found - please login first");
    }
    
    try {
      const response = await tutorialAPI.completeTutorial(tutorialId);
      
      // Immediately update local state
      setCompletedTutorials(prev => [...prev, tutorialId]);
      
      toast({
        title: 'Success!',
        description: `Tutorial "${response.tutorialTitle}" marked as complete!`,
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete tutorial';
      console.error('Tutorial completion error:', errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const isTutorialCompleted = (tutorialId: string): boolean => {
    return completedTutorials.includes(tutorialId);
  };

  return {
    tutorials,
    loading,
    error,
    completedTutorials,
    fetchTutorials,
    completeTutorial,
    isTutorialCompleted,
  };
};
