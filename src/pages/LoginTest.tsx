import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginTest = () => {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testLogin = async (testEmail: string, testPassword: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      const data = await res.json();
      
      setResult({
        status: res.status,
        success: res.ok,
        data,
        timestamp: new Date().toISOString()
      });

      console.log("Login test result:", {
        status: res.status,
        success: res.ok,
        data
      });

    } catch (err) {
      console.error("Login test error:", err);
      setResult({
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Login Authentication Test</h1>
      
      <div className="space-y-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Test Login Credentials</CardTitle>
            <CardDescription>Test different login scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Button 
              onClick={() => testLogin(email, password)}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Testing..." : "Test Login"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Test Scenarios</h2>
          <div className="grid gap-2">
            <Button 
              variant="outline" 
              onClick={() => testLogin("demo@example.com", "demo123")}
              disabled={loading}
            >
              Test Valid Credentials
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testLogin("wrong@example.com", "wrongpassword")}
              disabled={loading}
            >
              Test Invalid Credentials
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testLogin("nonexistent@example.com", "anypassword")}
              disabled={loading}
            >
              Test Nonexistent User
            </Button>
          </div>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong> {result.status}
                </div>
                <div>
                  <strong>Success:</strong> {result.success ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Timestamp:</strong> {result.timestamp}
                </div>
                {result.data && (
                  <div>
                    <strong>Response:</strong>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
                {result.error && (
                  <div>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Expected Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">Valid:</span>
                <span>demo@example.com / demo123 should succeed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">Invalid:</span>
                <span>wrong@example.com / wrongpassword should fail</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">Nonexistent:</span>
                <span>nonexistent@example.com should fail</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginTest;
