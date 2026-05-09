import { useEffect, useState } from "react";

const TutorialsDebug = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tutorials, setTutorials] = useState<any[]>([]);

  useEffect(() => {
    // Check if we can access the tutorials page
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    
    console.log("=== TUTORIALS DEBUG ===");
    console.log("Token exists:", !!storedToken);
    console.log("Token value:", storedToken?.substring(0, 20) + '...');
    
    if (!storedToken) {
      setError("No token found - please login first");
    } else {
      // Test API call
      fetch("http://localhost:5000/api/tutorials", {
        headers: {
          "Authorization": `Bearer ${storedToken}`
        }
      })
      .then(res => {
        console.log("API Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("API Response data:", data);
        setTutorials(data.tutorials || []);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("API call failed: " + err.message);
      });
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tutorials Debug</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Authentication Status</h2>
          <p>Token: {token ? "Found" : "Not found"}</p>
          {token && <p>Token: {token.substring(0, 20)}...</p>}
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Tutorials Data</h2>
          <p>Tutorials loaded: {tutorials.length}</p>
          {tutorials.length > 0 && (
            <ul className="mt-2 space-y-1">
              {tutorials.slice(0, 3).map((tutorial, index) => (
                <li key={index} className="text-sm">
                  - {tutorial.title} ({tutorial.level})
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {error && (
          <div className="p-4 border border-red-500 text-red-500 rounded">
            <h2 className="font-semibold">Error</h2>
            <p>{error}</p>
          </div>
        )}
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Test Links</h2>
          <div className="space-y-2">
            <a href="/auth" className="block text-blue-500 hover:underline">
              Go to Login Page
            </a>
            <a href="/learner/tutorials" className="block text-blue-500 hover:underline">
              Go to Tutorials Page (Should not redirect)
            </a>
            <a href="/test-connection" className="block text-blue-500 hover:underline">
              Test Connection Page
            </a>
          </div>
        </div>
        
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="font-semibold">Fix Applied</h2>
          <p className="text-sm">Removed automatic redirect from Tutorials component. The page should now load even without authentication and show appropriate error messages instead of redirecting.</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialsDebug;
