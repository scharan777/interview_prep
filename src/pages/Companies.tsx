import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, ArrowLeft, ExternalLink, BookOpen, Users } from 'lucide-react';
import interviewPanel from '@/assets/interview-panel.jpg';

const companyData = {
  'Product Companies': [
    {
      name: 'Google',
      type: 'Product',
      difficulty: 'Hard',
      process: 'Google has Online Coding Test, 4-5 Technical Rounds, and HR Round.',
      logo: '🎯',
      color: 'from-blue-500 to-blue-600',
      questions: [
        'Solve graph shortest path problem',
        'What is distributed computing?',
        'Explain Big-O notation'
      ],
      resources: [
        { title: 'Google Interview Prep', url: 'https://www.geeksforgeeks.org/google-interview-questions/' },
        { title: 'Google Coding Prep', url: 'https://www.youtube.com/results?search_query=Google+coding+interview' }
      ]
    },
    {
      name: 'Microsoft',
      type: 'Product',
      difficulty: 'Hard',
      process: 'Microsoft recruitment includes Online Test, 3-4 Technical Interviews, and HR Round.',
      logo: '🪟',
      color: 'from-blue-600 to-indigo-600',
      questions: [
        'Implement binary tree traversal',
        'What is multithreading in C#?',
        'Explain design patterns'
      ],
      resources: [
        { title: 'Microsoft Interview Prep', url: 'https://www.geeksforgeeks.org/microsoft-interview-questions/' },
        { title: 'Microsoft DSA Prep', url: 'https://www.youtube.com/results?search_query=Microsoft+DSA+interview' }
      ]
    },
    {
      name: 'Amazon',
      type: 'Product',
      difficulty: 'Hard',
      process: 'Amazon has Online Assessment, Technical Interviews, Bar Raiser, and HR Interview.',
      logo: '📦',
      color: 'from-orange-500 to-orange-600',
      questions: [
        'Implement LRU cache',
        'What is AWS EC2?',
        'Explain HashMap internals'
      ],
      resources: [
        { title: 'Amazon Interview Prep', url: 'https://www.geeksforgeeks.org/amazon-interview-questions/' },
        { title: 'Amazon SDE Prep', url: 'https://www.youtube.com/results?search_query=Amazon+SDE+interview' }
      ]
    }
  ],
  'Service Companies': [
    {
      name: 'TCS',
      type: 'Service',
      difficulty: 'Medium',
      process: 'TCS recruitment has 4 rounds: Aptitude Test, Technical Interview, Managerial Interview, and HR Interview.',
      logo: '🏢',
      color: 'from-blue-500 to-teal-600',
      questions: [
        'What is the time complexity of binary search?',
        'Explain OOPs concepts with examples',
        'What is normalization in DBMS?'
      ],
      resources: [
        { title: 'TCS NQT Prep', url: 'https://www.youtube.com/results?search_query=TCS+NQT+preparation' },
        { title: 'TCS Coding Questions', url: 'https://www.geeksforgeeks.org/tcs-coding-questions/' }
      ]
    },
    {
      name: 'Infosys',
      type: 'Service',
      difficulty: 'Medium',
      process: 'Infosys process usually includes Aptitude Test, Technical Interview, and HR Interview.',
      logo: '💼',
      color: 'from-purple-500 to-purple-600',
      questions: [
        'What are pointers in C?',
        'Difference between Java and Python?',
        'What is DBMS indexing?'
      ],
      resources: [
        { title: 'Infosys Interview Prep', url: 'https://www.youtube.com/results?search_query=Infosys+interview+questions' },
        { title: 'Infosys Prep Material', url: 'https://www.geeksforgeeks.org/infosys-interview-experience/' }
      ]
    },
    {
      name: 'Wipro',
      type: 'Service',
      difficulty: 'Medium',
      process: 'Wipro has Online Test, Technical Interview, and HR Interview.',
      logo: '🌐',
      color: 'from-green-500 to-green-600',
      questions: [
        'Explain polymorphism in OOP',
        'What are SQL joins?',
        'Explain difference between TCP and UDP'
      ],
      resources: [
        { title: 'Wipro Interview Prep', url: 'https://www.geeksforgeeks.org/wipro-interview-questions/' },
        { title: 'Wipro NTH Prep', url: 'https://www.youtube.com/results?search_query=Wipro+NTH+exam+prep' }
      ]
    },
    {
      name: 'Cognizant',
      type: 'Service',
      difficulty: 'Medium',
      process: 'Cognizant has Online Test, Technical Round, HR Round.',
      logo: '🔧',
      color: 'from-blue-500 to-cyan-600',
      questions: [
        'What is inheritance?',
        'Explain OSI model',
        'What is big data?'
      ],
      resources: [
        { title: 'Cognizant Interview Prep', url: 'https://www.geeksforgeeks.org/cognizant-interview-questions/' },
        { title: 'Cognizant Prep', url: 'https://www.youtube.com/results?search_query=Cognizant+interview+questions' }
      ]
    }
  ],
  'Consulting': [
    {
      name: 'Deloitte',
      type: 'Consulting',
      difficulty: 'Medium',
      process: 'Deloitte has Online Aptitude Test, Technical Interview, and HR Interview.',
      logo: '⚡',
      color: 'from-green-600 to-emerald-600',
      questions: [
        'What is ERP?',
        'Explain Agile methodology',
        'What are SQL joins?'
      ],
      resources: [
        { title: 'Deloitte Prep', url: 'https://www.geeksforgeeks.org/deloitte-interview-questions/' },
        { title: 'Deloitte Interview', url: 'https://www.youtube.com/results?search_query=Deloitte+interview' }
      ]
    },
    {
      name: 'Accenture',
      type: 'Consulting',
      difficulty: 'Medium',
      process: 'Accenture process includes Cognitive Ability Test, Technical Interview, HR Interview.',
      logo: '📊',
      color: 'from-purple-600 to-pink-600',
      questions: [
        'What is SDLC?',
        'Explain exception handling in Java',
        'What is REST API?'
      ],
      resources: [
        { title: 'Accenture Prep', url: 'https://www.geeksforgeeks.org/accenture-interview-questions/' },
        { title: 'Accenture Aptitude', url: 'https://www.youtube.com/results?search_query=Accenture+aptitude' }
      ]
    }
  ]
};

const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-prep-success/20 to-prep-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img 
            src={interviewPanel} 
            alt="Company Prep Hub" 
            className="w-16 h-16 object-cover rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Company Prep Hub</h1>
            <p className="text-muted-foreground">Get insights into company-specific interview processes</p>
          </div>
        </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {!selectedCompany ? (
        <Tabs defaultValue="Product Companies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="Product Companies">Product Companies</TabsTrigger>
            <TabsTrigger value="Service Companies">Service Companies</TabsTrigger>
            <TabsTrigger value="Consulting">Consulting</TabsTrigger>
          </TabsList>

          {Object.entries(companyData).map(([category, companies]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <Card 
                    key={company.name}
                    className="cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 hover:border-blue-300"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl p-3 rounded-full bg-gradient-to-r ${company.color} text-white`}>
                            {company.logo}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <CardDescription>{company.type}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getDifficultyColor(company.difficulty)} text-white`}>
                          {company.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {company.process}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">View Details →</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        /* Company Details */
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCompany(null)}
              className="flex items-center gap-2"
            >
              ← Back to Companies
            </Button>
            <div className="flex items-center gap-4">
              <div className={`text-3xl p-4 rounded-full bg-gradient-to-r ${selectedCompany.color} text-white`}>
                {selectedCompany.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{selectedCompany.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedCompany.type}</Badge>
                  <Badge className={`${getDifficultyColor(selectedCompany.difficulty)} text-white`}>
                    {selectedCompany.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Process Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Recruitment Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{selectedCompany.process}</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Preparation Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/interview" state={{ company: selectedCompany.name }}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    Practice Interview
                  </Button>
                </Link>
                <Link to="/questions">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Practice Questions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Previous Questions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Previous Interview Questions</CardTitle>
              <CardDescription>Questions frequently asked at {selectedCompany.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCompany.questions.map((question: string, index: number) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">Q{index + 1}</Badge>
                      <p className="text-gray-700 flex-1">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Study Resources</CardTitle>
              <CardDescription>External resources to help you prepare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCompany.resources.map((resource: any, index: number) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600 hover:underline">{resource.title}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Companies;