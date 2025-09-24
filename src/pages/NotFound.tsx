import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import rainyWindow from '@/assets/rainy-window.jpg';

const NotFound = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${rainyWindow})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 max-w-md w-full">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-prep-primary mb-4">404</div>
            <CardTitle className="text-2xl text-gray-900">Page Not Found</CardTitle>
            <CardDescription className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/" className="w-full block">
              <Button className="w-full bg-prep-primary hover:bg-prep-primary/90">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
