
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Cactus Illustration */}
      <div className="mb-8">
        <div className="cactus-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300">
            {/* Desert ground */}
            <path
              d="M10 100 Q30 95 50 100 T90 100 Q100 95 110 100 L110 110 L10 110 Z"
              fill="currentColor"
              opacity="0.3"
            />
            
            {/* Main cactus trunk */}
            <rect x="55" y="40" width="10" height="60" fill="currentColor" rx="5"/>
            
            {/* Left arm */}
            <path
              d="M45 60 Q40 55 40 50 Q40 45 45 45 Q50 45 50 50 L50 65 Q50 70 45 70 Q40 70 40 65 L40 55"
              fill="currentColor"
            />
            
            {/* Right arm */}
            <path
              d="M75 50 Q80 45 80 40 Q80 35 75 35 Q70 35 70 40 L70 55 Q70 60 75 60 Q80 60 80 55 L80 45"
              fill="currentColor"
            />
            
            {/* Small desert plants */}
            <circle cx="25" cy="95" r="2" fill="currentColor" opacity="0.4"/>
            <circle cx="30" cy="97" r="1.5" fill="currentColor" opacity="0.4"/>
            <circle cx="85" cy="96" r="1.5" fill="currentColor" opacity="0.4"/>
            <circle cx="90" cy="94" r="2" fill="currentColor" opacity="0.4"/>
            
            {/* Flying birds */}
            <path d="M70 25 Q72 23 74 25 Q72 27 70 25" fill="currentColor" opacity="0.5"/>
            <path d="M78 20 Q80 18 82 20 Q80 22 78 20" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Empty state text */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Its feeling like a dessert here...
        </h2>
        <p className="text-gray-500 text-sm">
          Add listings to start managing your client listings.
        </p>
      </div>

      {/* Create listing button */}
      <Button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Create listing</span>
      </Button>
    </div>
  );
};

export default EmptyState;
