
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/816a47f0-4c10-415f-a4d8-9b25448f3334.png" 
                alt="MAX DATA" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right side - Ask MAX button and user profile */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/ask-max">
                <span className="mr-2">✨</span>
                Ask MAX
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                  JW
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 hidden sm:inline">Joe Wilhelmy</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
