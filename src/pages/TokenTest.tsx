import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { markComplete, getAuthHeaders } from '@/utils/apiHelper';
import { useToast } from '@/hooks/use-toast';

const TokenTest = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    console.log("=== TOKEN TEST PAGE INIT ===");
    console.log("Token from localStorage:", storedToken);
  }, []);

  const addTestResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testTokenStorage = () => {
    console.log("=== TOKEN STORAGE TEST ===");
    const storedToken = localStorage.getItem("token");
    console.log("Token:", storedToken);
    
    if (storedToken) {
      addTestResult('Token Storage', true, `Token found: ${storedToken.substring(0, 20)}...`);
    } else {
      addTestResult('Token Storage', false, 'No token found in localStorage');
    }
  };

  const testAuthHeaders = () => {
    console.log("=== AUTH HEADERS TEST ===");
    const headers = getAuthHeaders();
    console.log("Auth headers:", headers);
    
    if (headers.Authorization) {
      addTestResult('Auth Headers', true, `Authorization: ${headers.Authorization.substring(0, 30)}...`);
    } else {
      addTestResult('Auth Headers', false, 'No Authorization header found');
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      console.log("=== LOGIN TEST ===");
      const response = await fetch("https://codequest-backend-yrse.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        addTestResult('Login', true, `Login successful, token stored`);
      } else {
        addTestResult('Login', false, data.message || 'Login failed');
      }
    } catch (error) {
      addTestResult('Login', false, error instanceof Error ? error.message : 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const testMarkComplete = async () => {
    console.log("=== MARK COMPLETE TEST ===");
    
    if (!token) {
      addTestResult('Mark Complete', false, 'No token available - please login first');
      return;
    }

    try {
      // First get a tutorial ID
      const tutorialsResponse = await fetch("https://codequest-backend-yrse.onrender.com/api/tutorials");
      const tutorialsData = await tutorialsResponse.json();
      
      if (tutorialsData.tutorials && tutorialsData.tutorials.length > 0) {
        const tutorialId = tutorialsData.tutorials[0]._id;
        const response = await markComplete(tutorialId);
        addTestResult('Mark Complete', true, `Tutorial completed: ${response.tutorialTitle}`);
      } else {
        addTestResult('Mark Complete', false, 'No tutorials available');
      }
    } catch (error) {
      addTestResult('Mark Complete', false, error instanceof Error ? error.message : 'Mark complete error');
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    testTokenStorage();
    testAuthHeaders();
    
    if (!token) {
      await testLogin();
    }
    
    if (token) {
      await testMarkComplete();
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    addTestResult('Clear Token', true, 'Token cleared from localStorage');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">JWT Token Authentication Test</h1>
        
        {/* Token Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Token Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Token in localStorage:</strong></p>
              <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                {token ? `${token.substring(0, 50)}...` : 'No token found'}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={testTokenStorage}>Test Token Storage</Button>
              <Button onClick={testAuthHeaders}>Test Auth Headers</Button>
              <Button onClick={clearToken} variant="outline">Clear Token</Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        {!token && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Test login functionality</CardDescription>
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
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run individual tests or all tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={runAllTests} disabled={loading}>
                Run All Tests
              </Button>
              <Button onClick={testMarkComplete} disabled={!token}>
                Test Mark Complete
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

export default TokenTest;
