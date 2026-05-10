import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Video, TrendingUp, MessageSquare, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supportAPI } from "@/services/api"

export default function MentorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supportRequests, setSupportRequests] = useState<any[]>([]);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/auth"; return; }

    const fetchAll = async () => {
      try {
        // Fetch mentor stats
        const statsRes = await fetch("https://codequest-backend-yrse.onrender.com/api/users/mentor-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (statsRes.status === 401) { window.location.href = "/auth"; return; }
        const statsData = await statsRes.json();
        setData(statsData);

        // Fetch support requests
        try {
          const requestsData = await supportAPI.getAllRequests();
          setSupportRequests(requestsData.requests || []);
        } catch (error) {
          console.error("Failed to fetch support requests:", error);
          setSupportRequests([]);
        }

      } catch (error) {
        toast({ title: "Failed to load dashboard", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (!data) return <div className="text-center py-8 text-destructive">Failed to load data.</div>;

  return (
    <>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold">Welcome, {data.mentor.name}!</h2>
          <p className="text-muted-foreground">Here is your mentoring overview</p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{data.stats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Learners</p>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-3xl font-bold">{data.stats.totalTutorials}</p>
              <p className="text-sm text-muted-foreground">Tutorials Available</p>
            </CardContent>
          </Card>
          <Card className="border-destructive/20">
            <CardContent className="p-6 text-center">
              <Video className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-3xl font-bold">{data.stats.activeSessions}</p>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Top students */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Performing Learners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topStudents.length === 0 && (
              <p className="text-sm text-muted-foreground">No learners registered yet.</p>
            )}
            {data.topStudents.map((student: any, i: number) => (
              <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {student.level} · {student.solvedProblems} problems solved
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{student.points} XP</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Requests */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Support Requests ({supportRequests.filter(r => r.status === 'pending').length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">No support requests yet.</p>
            )}
            {supportRequests.map((request) => (
              <div key={request._id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{request.userId.name}</p>
                    <Badge variant={
                      request.status === 'resolved' ? 'default' : 'secondary'
                    }>
                      {request.status}
                    </Badge>
                    <Badge variant="outline">
                      {request.category}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm mb-1">{request.title}</p>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                    {request.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                  </p>
                  {request.mentorResponse && (
                    <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                      <p className="font-medium text-sm text-green-800 mb-1">Your Response:</p>
                      <p className="text-sm text-green-700">{request.mentorResponse}</p>
                    </div>
                  )}
                </div>
                {request.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setResolveDialogOpen(true);
                    }}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resolve Request Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Support Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Learner</Label>
              <p className="font-medium">{selectedRequest?.userId?.name}</p>
            </div>
            <div>
              <Label>Category</Label>
              <Badge variant="outline">{selectedRequest?.category}</Badge>
            </div>
            <div>
              <Label>Title</Label>
              <p className="font-medium">{selectedRequest?.title}</p>
            </div>
            <div>
              <Label>Description</Label>
              <div className="p-3 bg-gray-50 rounded border">
                <p className="text-sm">{selectedRequest?.description}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your detailed response to help the learner..."
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setResolveDialogOpen(false);
                setSelectedRequest(null);
                setResponse("");
              }}>
                Cancel
              </Button>
              <Button onClick={async () => {
                if (!response.trim() || !selectedRequest) return;
                
                try {
                  await supportAPI.resolveRequest(selectedRequest._id, response);
                  toast({ title: "Request resolved successfully!" });
                  
                  // Update the request in the local state
                  setSupportRequests(prev => 
                    prev.map(req => 
                      req._id === selectedRequest._id 
                        ? { ...req, status: 'resolved', mentorResponse: response }
                        : req
                    )
                  );
                  
                  setResolveDialogOpen(false);
                  setSelectedRequest(null);
                  setResponse("");
                } catch (error) {
                  toast({ 
                    title: "Failed to resolve request", 
                    variant: "destructive" 
                  });
                }
              }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


