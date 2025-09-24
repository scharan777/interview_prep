import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BookOpen, Target, Clock, User, LogOut } from 'lucide-react';
import interviewDesk from '@/assets/interview-desk.jpg';

interface Profile {
  full_name: string;
  level: string;
  course: string;
}

interface InterviewSession {
  id: string;
  course: string;
  subject: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  completed_at: string;
  status: string;
  time_taken?: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch interview sessions
      const { data: sessionsData } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10);

      if (sessionsData) {
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = sessions.slice(0, 5).map((session, index) => ({
    name: `Test ${index + 1}`,
    score: session.score || 0,
    accuracy: (session.correct_answers / session.total_questions) * 100
  }));

  const averageScore = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-prep-primary/10 to-prep-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img 
            src={interviewDesk} 
            alt="Dashboard" 
            className="w-16 h-16 object-cover rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}!</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Button onClick={signOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <div className="flex items-center gap-1 text-blue-100">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Completed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-green-100">
              <Target className="h-4 w-4" />
              <span className="text-xs">Overall</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.level || 'Beginner'}</div>
            <div className="flex items-center gap-1 text-purple-100">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">{profile?.course || 'Not Set'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((sum, session) => sum + (session.time_taken || 0), 0)} min
            </div>
            <div className="flex items-center gap-1 text-orange-100">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Practicing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your recent interview session scores</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="accuracy" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sessions completed yet</p>
                  <p className="text-sm">Start your first interview to see your progress!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start practicing now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/interview" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                <Target className="h-4 w-4 mr-2" />
                Start Mock Interview
              </Button>
            </Link>
            <Link to="/questions" className="block">
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Practice Questions
              </Button>
            </Link>
            <Link to="/companies" className="block">
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Company Prep
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Interview Sessions</CardTitle>
          <CardDescription>Your latest practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.subject}</h3>
                      <p className="text-sm text-muted-foreground">{session.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={session.score >= 70 ? "default" : "secondary"}>
                      {session.score}%
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{session.correct_answers}/{session.total_questions}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sessions completed yet</p>
              <p className="text-sm">Complete your first interview to see your history here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;