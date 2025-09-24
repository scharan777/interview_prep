import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Brain, Calculator, BookOpen, Zap } from 'lucide-react';
import techBg from '@/assets/tech-bg.jpg';

const aptitudeCategories = [
  {
    title: 'Quantitative Aptitude',
    icon: <Calculator className="h-8 w-8" />,
    description: 'Mathematical and numerical reasoning',
    color: 'from-blue-500 to-blue-600',
    topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation', 'Time & Work', 'Probability'],
    resources: [
      { title: 'Khan Academy Math', url: 'https://www.khanacademy.org/math' },
      { title: 'IndiaBix Quantitative', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' }
    ]
  },
  {
    title: 'Logical Reasoning',
    icon: <Brain className="h-8 w-8" />,
    description: 'Pattern recognition and logical thinking',
    color: 'from-green-500 to-green-600',
    topics: ['Series', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Puzzles', 'Syllogism'],
    resources: [
      { title: 'GeeksforGeeks Logical Reasoning', url: 'https://www.geeksforgeeks.org/reasoning/' },
      { title: 'Logical Reasoning YouTube', url: 'https://www.youtube.com/results?search_query=logical+reasoning+preparation' }
    ]
  },
  {
    title: 'Verbal Ability',
    icon: <BookOpen className="h-8 w-8" />,
    description: 'English language and comprehension skills',
    color: 'from-purple-500 to-purple-600',
    topics: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Synonyms & Antonyms', 'Sentence Correction'],
    resources: [
      { title: 'English Grammar Guide', url: 'https://www.grammarly.com/blog/grammar/' },
      { title: 'Vocabulary Building', url: 'https://www.vocabulary.com/' }
    ]
  },
  {
    title: 'Technical Aptitude',
    icon: <Zap className="h-8 w-8" />,
    description: 'Programming and technical concepts',
    color: 'from-orange-500 to-orange-600',
    topics: ['Programming Concepts', 'Data Structures', 'Computer Networks', 'Operating Systems', 'DBMS'],
    resources: [
      { title: 'Technical MCQs', url: 'https://www.geeksforgeeks.org/quiz-corner-gq/' },
      { title: 'Programming Basics', url: 'https://www.codecademy.com/' }
    ]
  }
];

const generalResources = [
  { title: 'Aptitude Prep YouTube', url: 'https://www.youtube.com/results?search_query=aptitude+test+preparation' },
  { title: 'IndiaBix Complete Aptitude', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
  { title: 'GeeksforGeeks Aptitude', url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/' },
  { title: 'Testpot Practice Tests', url: 'https://testpot.com/' }
];

const Aptitude = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-prep-error/20 to-prep-primary/20 p-6 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${techBg})` }}
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Aptitude Test Hub</h1>
            <p className="text-muted-foreground">Enhance your aptitude skills across different domains</p>
          </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

        {/* Aptitude Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {aptitudeCategories.map((category) => (
          <Card key={category.title} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white`}>
                  {category.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Topics */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Key Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Study Resources:</h4>
                <div className="space-y-2">
                  {category.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Practice Button */}
              <Link to="/interview" state={{ type: 'aptitude', category: category.title }}>
                <Button className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 transition-opacity`}>
                  Practice {category.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* General Resources Section */}
        <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            General Aptitude Resources
          </CardTitle>
          <CardDescription>Comprehensive study materials and practice tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <ExternalLink className="h-5 w-5 text-blue-600 group-hover:text-blue-800" />
                <span className="text-blue-600 group-hover:text-blue-800 hover:underline">
                  {resource.title}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

        {/* Tips Section */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Aptitude Test Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Preparation Strategy</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Practice regularly for at least 1-2 hours daily</li>
                <li>• Focus on time management and speed</li>
                <li>• Solve previous year question papers</li>
                <li>• Identify weak areas and work on them</li>
                <li>• Take mock tests frequently</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Test Day Tips</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Read questions carefully and completely</li>
                <li>• Don't spend too much time on difficult questions</li>
                <li>• Use elimination method for multiple choice</li>
                <li>• Keep track of time throughout the test</li>
                <li>• Stay calm and confident</li>
              </ul>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Aptitude;