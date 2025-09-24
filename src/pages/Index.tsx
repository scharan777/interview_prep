import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Brain, Target, MessageCircle, BarChart3 } from 'lucide-react';
import { ChatBot } from '@/components/ChatBot';
import gradientBg from '@/assets/gradient-bg.jpg';

const Index = () => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${gradientBg})` }}
      />
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
            Welcome to <span className="text-purple-300">PrepHub</span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-12 drop-shadow-lg font-light tracking-wide">
            Your Interview Success Partner <br />
            Practice. Learn. Succeed.
          </p>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Link to="/dashboard" className="group">
              <Card className="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2">
                  <BarChart3 className="h-8 w-8 text-blue-300 mx-auto" />
                  <CardTitle className="text-white">Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-200">
                    Track your progress and performance
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/questions" className="group">
              <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2">
                  <BookOpen className="h-8 w-8 text-yellow-300 mx-auto" />
                  <CardTitle className="text-white">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-200">
                    Practice with curated questions
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/companies" className="group">
              <Card className="bg-gradient-to-r from-teal-500/20 to-green-600/20 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2">
                  <Users className="h-8 w-8 text-teal-300 mx-auto" />
                  <CardTitle className="text-white">Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-200">
                    Learn about specific companies
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/aptitude" className="group">
              <Card className="bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2">
                  <Brain className="h-8 w-8 text-orange-300 mx-auto" />
                  <CardTitle className="text-white">Aptitude Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-200">
                    Improve your aptitude skills
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link to="/interview" className="group sm:col-span-2 lg:col-span-1">
              <Card className="bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2">
                  <Target className="h-8 w-8 text-red-300 mx-auto" />
                  <CardTitle className="text-white">Mock Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-200">
                    Start your practice session
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Auth Section */}
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-full px-6 py-3 shadow-lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {isChatOpen ? 'Close Chat' : 'Chat with AI'}
        </Button>

        {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
      </div>
    </main>
  );
};

export default Index;
