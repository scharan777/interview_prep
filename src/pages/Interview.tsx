import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, CheckCircle, XCircle, Target } from 'lucide-react';
import interviewScene from '@/assets/interview-scene.png';

// Sample questions data
const sampleQuestions = {
  MCA: {
    SQL: [
      { question: "Which SQL command retrieves data?", options: ["SELECT", "UPDATE", "INSERT", "DELETE"], answer: "SELECT" },
      { question: "Which clause filters records?", options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"], answer: "WHERE" },
      { question: "What is a primary key?", options: ["Unique identifier", "Duplicate value", "Foreign key", "Index"], answer: "Unique identifier" }
    ],
    Python: [
      { question: "Which keyword defines a function?", options: ["func", "def", "function", "lambda"], answer: "def" },
      { question: "Which collection type is immutable?", options: ["List", "Tuple", "Set", "Dict"], answer: "Tuple" },
      { question: "What is Python's GIL?", options: ["Global Interpreter Lock", "Global Input Layer", "General Instance Lock", "Global Index Library"], answer: "Global Interpreter Lock" }
    ]
  },
  BCA: {
    Java: [
      { question: "Which keyword defines a class?", options: ["class", "Class", "struct", "def"], answer: "class" },
      { question: "Which operator compares objects?", options: ["==", "equals()", "compare()", "==="], answer: "equals()" },
      { question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Model", "Java Version Manager", "Java Visual Model"], answer: "Java Virtual Machine" }
    ]
  }
};

const courses = {
  MCA: ["SQL", "Python", "Java", "C", "C++", "MongoDB", "JavaScript", "OS", "Networking", "DBMS"],
  BCA: ["C", "C++", "Java", "Python", "SQL", "DBMS", "OS", "HTML", "CSS", "JavaScript"],
  MCom: ["Accounting", "Finance", "Economics", "Business Law", "Taxation", "Auditing", "Marketing", "Statistics"],
  BCom: ["Accounting", "Economics", "Finance", "Taxation", "Management", "Statistics", "Banking", "Marketing"],
  BTech: ["C", "C++", "Java", "Python", "SQL", "DBMS", "OS", "DSA", "CN", "Software Engineering"],
};

const Interview = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Check if coming from state (from Questions or Companies page)
  useEffect(() => {
    if (location.state) {
      const { course, subject, company, type } = location.state as any;
      if (course && subject) {
        setSelectedCourse(course);
        setSelectedSubject(subject);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedCourse && selectedSubject) {
      loadQuestions();
    }
  }, [selectedCourse, selectedSubject]);

  const loadQuestions = () => {
    // Get questions for the selected course and subject
    const courseQuestions = sampleQuestions[selectedCourse as keyof typeof sampleQuestions];
    if (courseQuestions && courseQuestions[selectedSubject as keyof typeof courseQuestions]) {
      setQuestions(courseQuestions[selectedSubject as keyof typeof courseQuestions]);
    } else {
      // Fallback to generic questions
      setQuestions([
        { question: `Sample ${selectedSubject} question 1`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option A" },
        { question: `Sample ${selectedSubject} question 2`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option B" },
        { question: `Sample ${selectedSubject} question 3`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option C" }
      ]);
    }
  };

  const startSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          course: selectedCourse,
          subject: selectedSubject,
          total_questions: questions.length,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setStartTime(new Date());
      toast({
        title: "Session Started",
        description: `Starting ${selectedSubject} interview practice`
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive"
      });
    }
  };

  const handleAnswer = async (selectedOption: string) => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Save answer to database if user is logged in
    if (user && sessionId) {
      try {
        await supabase.from('user_answers').insert({
          session_id: sessionId,
          question_id: null, // We'll need to create questions in DB for this
          user_answer: selectedOption,
          is_correct: isCorrect
        });
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }

    // Move to next question or show results
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      await finishSession();
    }
  };

  const finishSession = async () => {
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60) : 0;
    
    setScore(finalScore);
    setShowResult(true);

    // Update session in database
    if (user && sessionId) {
      try {
        await supabase
          .from('interview_sessions')
          .update({
            correct_answers: correctAnswers,
            score: finalScore,
            status: 'completed',
            completed_at: new Date().toISOString(),
            time_taken: timeTaken
          })
          .eq('id', sessionId);

        toast({
          title: "Session Completed",
          description: `You scored ${finalScore}% in ${selectedSubject}!`
        });
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }
  };

  const resetSession = () => {
    setSelectedCourse('');
    setSelectedSubject('');
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setScore(0);
    setShowResult(false);
    setSessionId('');
    setStartTime(null);
    setQuestions([]);
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-prep-primary/10 to-prep-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img 
            src={interviewScene} 
            alt="Mock Interview" 
            className="w-16 h-16 object-cover rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Mock Interview</h1>
            <p className="text-muted-foreground">Practice with real interview questions</p>
          </div>
        </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {!selectedCourse ? (
          /* Course Selection */
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Select Your Course</CardTitle>
              <CardDescription className="text-center">Choose the course you want to practice for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.keys(courses).map((course) => (
                  <Button
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    variant="outline"
                    className="h-20 text-lg font-semibold hover:bg-purple-50 hover:border-purple-300"
                  >
                    {course}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !selectedSubject ? (
          /* Subject Selection */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCourse} - Select Subject</CardTitle>
                  <CardDescription>Choose a subject to start your practice session</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedCourse('')}>
                  ← Back to Courses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {courses[selectedCourse as keyof typeof courses].map((subject) => (
                  <Button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      if (user) startSession();
                    }}
                    variant="outline"
                    className="h-16 text-base font-medium hover:bg-blue-50 hover:border-blue-300"
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !showResult ? (
          /* Question Display */
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedCourse}</Badge>
                    <Badge variant="secondary">{selectedSubject}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {questions[currentQuestion]?.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions[currentQuestion]?.options.map((option: string, index: number) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Display */
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {score >= 70 ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : score >= 50 ? (
                  <Target className="h-16 w-16 text-yellow-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">Interview Complete!</CardTitle>
              <CardDescription>Here's how you performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{score}%</div>
                <p className="text-gray-600">
                  You answered {correctAnswers} out of {questions.length} questions correctly
                </p>
              </div>

              {/* Performance Badge */}
              <div className="text-center">
                {score >= 70 ? (
                  <Badge className="bg-green-500 text-white px-4 py-2 text-base">Excellent Performance! 🎉</Badge>
                ) : score >= 50 ? (
                  <Badge className="bg-yellow-500 text-white px-4 py-2 text-base">Good Job! Keep Practicing 👍</Badge>
                ) : (
                  <Badge className="bg-red-500 text-white px-4 py-2 text-base">Need More Practice 📚</Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setSelectedSubject('');
                    setCurrentQuestion(0);
                    setCorrectAnswers(0);
                    setShowResult(false);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Try Another Subject
                </Button>
                <Button 
                  onClick={resetSession}
                  variant="outline"
                >
                  Start Over
                </Button>
                <Link to="/dashboard">
                  <Button variant="outline">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interview;