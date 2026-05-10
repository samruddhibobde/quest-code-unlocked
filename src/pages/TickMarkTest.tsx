import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const TickMarkTest = () => {
  const [token, setToken] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [testTutorial] = useState({ _id: "test-tutorial-123", title: "Test Tutorial" });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    
    // Load completed tutorials from backend
    if (storedToken) {
      fetch("https://codequest-backend-yrse.onrender.com/api/users/profile", {
        headers: {
          "Authorization": `Bearer ${storedToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setCompletedTutorials(data.completedTutorials || []);
      })
      .catch(err => console.error("Failed to load user data:", err));
    }
  }, []);

  const isCompleted = (tutorialId: string) => {
    return completedTutorials.includes(tutorialId);
  };

  const handleMarkComplete = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch("https://codequest-backend-yrse.onrender.com/api/tutorials/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ tutorialId: testTutorial._id })
      });

      const data = await res.json();
      console.log("Complete response:", data);

      if (!res.ok) {
        alert(data.message || "Failed to mark complete");
        return;
      }

      // Update local state immediately
      setCompletedTutorials(prev => [...prev, testTutorial._id]);
      
      alert(`Tutorial "${data.tutorialTitle}" marked as complete!`);
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tick Mark Test</h1>
      
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {testTutorial.title}
            {isCompleted(testTutorial._id) && <CheckCircle className="w-5 h-5 text-green-500" />}
          </CardTitle>
          <CardDescription>Test tutorial for tick mark functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <span className={isCompleted(testTutorial._id) ? "text-green-500" : "text-gray-500"}>
              {isCompleted(testTutorial._id) ? "Completed" : "Not Completed"}
            </span>
          </div>
          
          <Button 
            onClick={handleMarkComplete}
            disabled={isCompleted(testTutorial._id)}
            className="flex items-center gap-2"
          >
            {isCompleted(testTutorial._id) ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Completed
              </>
            ) : (
              "Mark Complete"
            )}
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>Token: {token ? "Found" : "Not found"}</p>
            <p>Completed Tutorials: {completedTutorials.length}</p>
            <p>Test Tutorial ID: {testTutorial._id}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Test Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click "Mark Complete" button</li>
          <li>Tick mark should appear immediately in button</li>
          <li>Tick mark should appear in title as well</li>
          <li>Progress should be saved to database</li>
          <li>Refresh page - tick mark should persist</li>
        </ol>
        
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Database Persistence</h3>
          <p className="text-sm">The tutorial completion is saved to MongoDB using $addToSet to avoid duplicates. The progress persists across page refreshes and browser sessions.</p>
        </div>
      </div>
    </div>
  );
};

export default TickMarkTest;
