import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorialAPI, authAPI } from '@/services/api';
import { useAuth } from '@/components/AuthProvider';
import LoginForm from '@/components/LoginForm';

const TestConnection = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testTutorialsAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await tutorialAPI.getTutorials();
      setTutorials(response.tutorials);
      console.log('Tutorials fetched:', response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tutorials';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-4">
          <h1 className="text-2xl font-bold text-center mb-6">CodeQuest Backend Connection Test</h1>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Test credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">CodeQuest Backend Connection Test</h1>
          <div className="flex items-center gap-4">
            <span className="text-green-600">✅ Authenticated as {user?.name}</span>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Current user data from backend</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Points:</strong> {user.points}</p>
                  <p><strong>Level:</strong> {user.level}</p>
                  <p><strong>Solved Problems:</strong> {user.solvedProblems}</p>
                  <p><strong>Completed Tutorials:</strong> {user.completedTutorials.length}</p>
                </div>
              ) : (
                <p>No user data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutorials API Test</CardTitle>
              <CardDescription>Fetch tutorials from backend</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testTutorialsAPI} disabled={loading} className="mb-4">
                {loading ? 'Loading...' : 'Fetch Tutorials'}
              </Button>
              
              {error && (
                <div className="text-red-500 mb-4">
                  <p>Error: {error}</p>
                </div>
              )}
              
              {tutorials.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tutorials ({tutorials.length}):</h3>
                  <ul className="space-y-1 text-sm">
                    {tutorials.map((tutorial) => (
                      <li key={tutorial._id} className="flex justify-between">
                        <span>{tutorial.title}</span>
                        <span className="text-gray-500">{tutorial.level} - {tutorial.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Backend connectivity check</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Backend URL:</strong> http://localhost:5000</p>
                <p><strong>Frontend URL:</strong> http://localhost:8080</p>
                <p><strong>Authentication:</strong> <span className="text-green-600">✅ Working</span></p>
                <p><strong>Tutorials API:</strong> {tutorials.length > 0 ? <span className="text-green-600">✅ Working</span> : <span className="text-yellow-600">⏳ Not tested</span>}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
