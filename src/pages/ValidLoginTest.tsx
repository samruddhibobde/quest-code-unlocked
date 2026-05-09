import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validLogin } from '@/services/validAuth';
import { useToast } from '@/hooks/use-toast';

const ValidLoginTest = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const addTestResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testCorrectLogin = async () => {
    setLoading(true);
    try {
      console.log("=== CORRECT LOGIN TEST ===");
      const response = await validLogin(email, password);
      
      console.log("Correct login response:", response);
      addTestResult('Correct Login', true, `Login successful for ${response.user.name}`);
    } catch (error) {
      console.error("Correct login error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      addTestResult('Correct Login', false, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testWrongLogin = async () => {
    setLoading(true);
    try {
      console.log("=== WRONG LOGIN TEST ===");
      const response = await validLogin(email, "wrongpassword");
      
      console.log("Wrong login response:", response);
      addTestResult('Wrong Login', false, 'Login should have failed but succeeded');
    } catch (error) {
      console.error("Wrong login error (expected):", error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      addTestResult('Wrong Login', true, `Correctly failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testTokenStorage = () => {
    console.log("=== TOKEN STORAGE TEST ===");
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token?.substring(0, 20) + '...');
    
    if (token) {
      addTestResult('Token Storage', true, `Token found: ${token.substring(0, 20)}...`);
    } else {
      addTestResult('Token Storage', false, 'No token found');
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    addTestResult('Clear Token', true, 'Token cleared from localStorage');
  };

  const runAllTests = async () => {
    setTestResults([]);
    testTokenStorage();
    
    // Test wrong login first
    await testWrongLogin();
    
    // Clear any token from wrong test
    localStorage.removeItem("token");
    
    // Test correct login
    await testCorrectLogin();
    
    // Verify token after correct login
    testTokenStorage();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Valid Login Test</h1>
        
        {/* Token Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Token Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Token in localStorage:</strong></p>
              <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                {localStorage.getItem("token") ? `${localStorage.getItem("token")!.substring(0, 50)}...` : 'No token found'}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={testTokenStorage}>Test Token Storage</Button>
              <Button onClick={clearToken} variant="outline">Clear Token</Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Validated Login Test</CardTitle>
            <CardDescription>Test login validation with correct and wrong credentials</CardDescription>
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
              <div className="flex gap-2">
                <Button onClick={testCorrectLogin} disabled={loading}>
                  {loading ? 'Testing...' : 'Test Correct Login'}
                </Button>
                <Button onClick={testWrongLogin} disabled={loading} variant="outline">
                  Test Wrong Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run all validation tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
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

export default ValidLoginTest;
