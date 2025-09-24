import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your PrepHub Assistant. How can I help you with your interview preparation today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save message to database if user is authenticated
      if (user) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          message: input,
          session_type: 'general'
        });
      }

      // Simulate AI response (replace with actual AI API call)
      const botResponse = await simulateAIResponse(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Update database with response if user is authenticated
      if (user) {
        await supabase
          .from('chat_messages')
          .update({ response: botResponse })
          .eq('user_id', user.id)
          .eq('message', input);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message: string): Promise<string> => {
    // Simple keyword-based responses (replace with actual AI API)
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('interview') && lowerMessage.includes('tips')) {
      return "Here are some key interview tips:\n\n1. Research the company thoroughly\n2. Practice common questions\n3. Prepare specific examples using STAR method\n4. Dress professionally\n5. Arrive early and be confident\n\nWould you like me to elaborate on any of these points?";
    }
    
    if (lowerMessage.includes('technical') || lowerMessage.includes('coding')) {
      return "For technical interviews:\n\n• Practice DSA problems daily\n• Understand time/space complexity\n• Learn system design basics\n• Be familiar with your resume projects\n• Practice explaining your thought process\n\nWhat specific technical topic would you like help with?";
    }
    
    if (lowerMessage.includes('nervous') || lowerMessage.includes('anxiety')) {
      return "It's completely normal to feel nervous! Here's how to manage interview anxiety:\n\n• Practice mock interviews\n• Prepare thoroughly\n• Use breathing techniques\n• Visualize success\n• Remember they want you to succeed\n\nYou've got this! 💪";
    }
    
    if (lowerMessage.includes('questions') || lowerMessage.includes('practice')) {
      return "Great! I recommend practicing with our question banks. You can find them in the 'Questions' section. We have questions categorized by:\n\n• Course (MCA, BCA, BTech, etc.)\n• Subject (Java, Python, SQL, etc.)\n• Difficulty level\n\nStart with your course and pick a subject you want to focus on!";
    }
    
    return "I understand you're asking about interview preparation. I can help you with:\n\n• Interview tips and strategies\n• Technical question practice\n• Company-specific preparation\n• Managing interview anxiety\n• Mock interview sessions\n\nWhat specific area would you like to focus on?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="mt-4 w-80 h-96 bg-white/95 backdrop-blur-sm shadow-2xl border-white/20 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-purple-700">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            PrepHub Assistant
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                      message.sender === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};