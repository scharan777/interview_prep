import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Database, Globe, ArrowLeft } from 'lucide-react';
import questionMarkImg from '@/assets/question-mark.jpeg';

// Static question data (can be moved to database later)
const questionData = {
  MCA: {
    subjects: ['SQL', 'Python', 'Java', 'C', 'C++', 'MongoDB', 'JavaScript', 'OS', 'Networking', 'DBMS'],
    icon: <Database className="h-6 w-6" />
  },
  BCA: {
    subjects: ['C', 'C++', 'Java', 'Python', 'SQL', 'DBMS', 'OS', 'HTML', 'CSS', 'JavaScript'],
    icon: <Code className="h-6 w-6" />
  },
  BTech: {
    subjects: ['C', 'C++', 'Java', 'Python', 'SQL', 'DBMS', 'OS', 'DSA', 'CN', 'Software Engineering'],
    icon: <Globe className="h-6 w-6" />
  },
  MCom: {
    subjects: ['Accounting', 'Finance', 'Economics', 'Business Law', 'Taxation', 'Auditing', 'Marketing', 'Statistics'],
    icon: <BookOpen className="h-6 w-6" />
  },
  BCom: {
    subjects: ['Accounting', 'Economics', 'Finance', 'Taxation', 'Management', 'Statistics', 'Banking', 'Marketing'],
    icon: <BookOpen className="h-6 w-6" />
  }
};

const sampleQuestions = {
  SQL: [
    { question: "Which SQL command retrieves data?", difficulty: "easy" },
    { question: "What is the difference between INNER JOIN and LEFT JOIN?", difficulty: "medium" },
    { question: "Explain database normalization", difficulty: "hard" }
  ],
  Python: [
    { question: "Which keyword defines a function?", difficulty: "easy" },
    { question: "What is Python's GIL?", difficulty: "hard" },
    { question: "Explain list comprehension", difficulty: "medium" }
  ],
  Java: [
    { question: "Which keyword defines a class?", difficulty: "easy" },
    { question: "What does JVM stand for?", difficulty: "medium" },
    { question: "Explain polymorphism in Java", difficulty: "hard" }
  ]
};

const Questions = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-prep-warning/20 to-prep-accent/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img 
            src={questionMarkImg} 
            alt="Question Bank" 
            className="w-16 h-16 object-cover rounded-full shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Question Bank</h1>
            <p className="text-muted-foreground">Practice with curated questions by course and subject</p>
          </div>
        </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {!selectedCourse ? (
        /* Course Selection */
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Select Your Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(questionData).map(([course, data]) => (
              <Card 
                key={course}
                className="cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-orange-50 border-orange-200 hover:shadow-lg"
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                    {data.icon}
                  </div>
                  <CardTitle className="text-orange-800">{course}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 mb-4">
                    {data.subjects.length} subjects available
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {data.subjects.slice(0, 3).map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {data.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{data.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : !selectedSubject ? (
        /* Subject Selection */
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCourse('')}
              className="flex items-center gap-2"
            >
              ← Back to Courses
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">{selectedCourse} - Select Subject</h2>
              <p className="text-gray-600">Choose a subject to practice questions</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {questionData[selectedCourse as keyof typeof questionData].subjects.map((subject) => (
              <Card 
                key={subject}
                className="cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg"
                onClick={() => setSelectedSubject(subject)}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-blue-800 mb-2">{subject}</h3>
                  <Badge variant="outline" className="text-xs">
                    {sampleQuestions[subject as keyof typeof sampleQuestions]?.length || 5} questions
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Question Display */
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedSubject('')}
              className="flex items-center gap-2"
            >
              ← Back to Subjects
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">{selectedSubject} Questions</h2>
              <p className="text-gray-600">{selectedCourse} • Practice Questions</p>
            </div>
          </div>

          <Tabs defaultValue="practice" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice">Practice Mode</TabsTrigger>
              <TabsTrigger value="browse">Browse Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice" className="space-y-6">
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Ready to Practice?</h3>
                  <p className="mb-6">Start a timed practice session with {selectedSubject} questions</p>
                  <Link to="/interview" state={{ course: selectedCourse, subject: selectedSubject }}>
                    <Button className="bg-white text-purple-600 hover:bg-gray-100">
                      Start Practice Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="browse" className="space-y-4">
              {(sampleQuestions[selectedSubject as keyof typeof sampleQuestions] || [
                { question: `Sample ${selectedSubject} question 1`, difficulty: 'easy' },
                { question: `Sample ${selectedSubject} question 2`, difficulty: 'medium' },
                { question: `Sample ${selectedSubject} question 3`, difficulty: 'hard' }
              ]).map((q, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Question {index + 1}
                        </h4>
                        <p className="text-gray-700">{q.question}</p>
                      </div>
                      <Badge 
                        className={`${getDifficultyColor(q.difficulty)} text-white ml-4`}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>More questions available in practice mode</p>
                  <p className="text-sm">Start a practice session to access all questions</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Questions;