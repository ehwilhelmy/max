import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

const mockAddresses = [
  '123 Main St, Miami FL',
  '456 Oak Ave, Orlando FL',
  '789 Pine Rd, Tampa FL',
  '101 Maple Dr, Jacksonville FL',
  '202 Elm St, St. Petersburg FL',
];

const CreateListingPrompt = () => {
  const [address, setAddress] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }
    setError('');
    navigate('/new-listing', { state: { address } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav with breadcrumbs */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" className="mr-3" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <nav className="flex items-center text-gray-500 text-base">
            <Link to="/" className="font-bold text-gray-900 hover:underline">MAX DATA</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 font-medium">Find a listing</span>
          </nav>
        </div>
      </header>
      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="w-full max-w-xl flex flex-col items-center mt-16">
          {/* House icon */}
          <div className="mb-4">
            <Home className="w-12 h-12 text-blue-700 mx-auto" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find a listing</h1>
          <p className="text-gray-500 text-lg mb-8">Enter a property address to start a new listing</p>
          <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
            <div className="flex items-center px-0 pb-6 pt-2 relative">
              <input
                type="text"
                placeholder="Search for a location..."
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  setShowSuggestions(true);
                }}
                className="flex-1 bg-gray-50 border-0 text-lg placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-100 px-4 py-3 shadow"
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              <Button 
                type="submit"
                size="icon"
                className="ml-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                disabled={!address}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              {/* Suggestions dropdown */}
              {showSuggestions && address && (
                <div className="absolute left-0 right-0 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {mockAddresses.filter(addr => addr.toLowerCase().includes(address.toLowerCase())).length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">No results</div>
                  ) : (
                    mockAddresses.filter(addr => addr.toLowerCase().includes(address.toLowerCase())).map((addr, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                        onMouseDown={() => {
                          setAddress(addr);
                          setShowSuggestions(false);
                        }}
                      >
                        {addr}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </form>
          {error && <div className="text-red-600 px-0 pb-2 text-sm w-full text-left">{error}</div>}
        </div>
      </main>
    </div>
  );
};

export default CreateListingPrompt; 