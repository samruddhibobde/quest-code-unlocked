import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, getToken, getTutorials, completeTutorial } from '@/services/apiClean';
import { useToast } from '@/hooks/use-toast';

const CleanTest = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const addTestResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testTokenStorage = () => {
    console.log("=== TOKEN STORAGE TEST ===");
    const token = getToken();
    console.log("Token:", token?.substring(0, 20) + '...');
    
    if (token) {
      addTestResult('Token Storage', true, `Token found: ${token.substring(0, 20)}...`);
    } else {
      addTestResult('Token Storage', false, 'No token found');
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      console.log("=== LOGIN TEST ===");
      console.log("Email:", email);
      console.log("Password:", password);
      
      const response = await login(email, password);
      
      console.log("Login response:", response);
      addTestResult('Login', true, `Login successful for ${response.user.name}`);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      addTestResult('Login', false, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testTutorials = async () => {
    try {
      console.log("=== TUTORIALS TEST ===");
      const response = await getTutorials();
      console.log("Tutorials response:", response);
      addTestResult('Get Tutorials', true, `Found ${response.count} tutorials`);
    } catch (error) {
      console.error("Tutorials error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tutorials';
      addTestResult('Get Tutorials', false, errorMessage);
    }
  };

  const testCompleteTutorial = async () => {
    try {
      console.log("=== COMPLETE TUTORIAL TEST ===");
      // First get tutorials to find an ID
      const tutorialsResponse = await getTutorials();
      
      if (tutorialsResponse.tutorials && tutorialsResponse.tutorials.length > 0) {
        const tutorialId = tutorialsResponse.tutorials[0]._id;
        console.log("Tutorial ID:", tutorialId);
        
        const response = await completeTutorial(tutorialId);
        console.log("Complete response:", response);
        addTestResult('Complete Tutorial', true, `Completed: ${response.tutorialTitle}`);
      } else {
        addTestResult('Complete Tutorial', false, 'No tutorials available');
      }
    } catch (error) {
      console.error("Complete tutorial error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete tutorial';
      addTestResult('Complete Tutorial', false, errorMessage);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    testTokenStorage();
    
    if (!getToken()) {
      await testLogin();
    }
    
    if (getToken()) {
      await testTutorials();
      await testCompleteTutorial();
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    addTestResult('Clear Token', true, 'Token cleared from localStorage');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clean Authentication Test</h1>
        
        {/* Token Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Token Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Token in localStorage:</strong></p>
              <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                {getToken() ? `${getToken()!.substring(0, 50)}...` : 'No token found'}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={testTokenStorage}>Test Token Storage</Button>
              <Button onClick={clearToken} variant="outline">Clear Token</Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        {!getToken() && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Login Test</CardTitle>
              <CardDescription>Test clean login functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  {loading ? 'Logging in...' : 'Test Login'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Test clean authentication flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={runAllTests} disabled={loading}>
                Run All Tests
              </Button>
              <Button onClick={testTutorials} disabled={!getToken()}>
                Test Get Tutorials
              </Button>
              <Button onClick={testCompleteTutorial} disabled={!getToken()}>
                Test Complete Tutorial
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

export default CleanTest;
