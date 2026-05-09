import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI, tutorialAPI } from '@/services/api';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const TutorialTest = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const addTestResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      await authAPI.login(email, password);
      addTestResult('Login', true, 'Login successful');
    } catch (error) {
      addTestResult('Login', false, error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const testTutorials = async () => {
    try {
      const response = await tutorialAPI.getTutorials();
      addTestResult('Fetch Tutorials', true, `Found ${response.count} tutorials`);
    } catch (error) {
      addTestResult('Fetch Tutorials', false, error instanceof Error ? error.message : 'Failed to fetch');
    }
  };

  const testCompleteTutorial = async () => {
    try {
      // First get tutorials to find an ID
      const tutorialsResponse = await tutorialAPI.getTutorials();
      if (tutorialsResponse.tutorials.length > 0) {
        const tutorialId = tutorialsResponse.tutorials[0]._id;
        const response = await tutorialAPI.completeTutorial(tutorialId);
        addTestResult('Complete Tutorial', true, `Completed: ${response.tutorialTitle}`);
      } else {
        addTestResult('Complete Tutorial', false, 'No tutorials available');
      }
    } catch (error) {
      addTestResult('Complete Tutorial', false, error instanceof Error ? error.message : 'Failed to complete');
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    if (!isAuthenticated) {
      await testLogin();
    }
    
    await testTutorials();
    await testCompleteTutorial();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tutorial Integration Test</h1>
        
        {/* Authentication Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Points:</strong> {user.points}</p>
                </>
              )}
            </div>
            
            {!isAuthenticated && (
              <div className="mt-4 space-y-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button onClick={testLogin} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run individual tests or all tests at once</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={testLogin} disabled={loading || !isAuthenticated}>
                Test Login
              </Button>
              <Button onClick={testTutorials} disabled={!isAuthenticated}>
                Test Fetch Tutorials
              </Button>
              <Button onClick={testCompleteTutorial} disabled={!isAuthenticated}>
                Test Complete Tutorial
              </Button>
              <Button onClick={runAllTests} disabled={loading}>
                Run All Tests
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-muted-foreground">No tests run yet</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.test}</span>
                      <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.success ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorialTest;
