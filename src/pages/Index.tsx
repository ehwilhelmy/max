import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import ListingCard from '../components/listing/ListingCard';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';

const Index = () => {
  const [listings, setListings] = useState<any[]>([]);
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [filter, setFilter] = useState('All');
  useEffect(() => {
    const stored = localStorage.getItem('maxdata_listings');
    setListings(stored ? JSON.parse(stored) : []);
    // Only show confetti if a listing was just published (not for drafts or other actions)
    if (location.search.includes('published=1')) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
    // Update window size for confetti
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.search]);

  const filteredListings = filter === 'All'
    ? listings
    : listings.filter(l => (l.status || 'Draft') === filter);

  // Get cart count from the most recent published listing (if any)
  let cartCount = 0;
  const published = listings.filter(l => l.status === 'Published');
  if (published.length > 0 && Array.isArray(published[published.length - 1].cart)) {
    cartCount = published[published.length - 1].cart.length;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      <main className="container mx-auto px-4 py-8">
        {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />} 
        {showConfetti && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow z-50 font-semibold text-lg">
            Listing published!
          </div>
        )}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-semibold text-gray-800 mb-0">My listings</h1>
              {listings.length > 0 && (
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('All')}
                  >
                    All
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${filter === 'Published' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('Published')}
                  >
                    Published
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${filter === 'Draft' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('Draft')}
                  >
                    Draft
                  </button>
                </div>
              )}
            </div>
            {filteredListings.length > 0 && (
              <button
                className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow"
                onClick={() => window.location.href = '/create-listing'}
              >
                <span className="text-lg font-bold">+</span> Create listing
              </button>
            )}
          </div>
        </div>
        {filteredListings.length === 0 ? (
        <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing, idx) => (
              <ListingCard key={idx} listing={listing} />
            ))}
          </div>
        )}
      </main>
      {filteredListings.length > 0 && (
        <div className="flex justify-center mt-12">
          <button
            className="px-6 py-2 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
            onClick={() => {
              localStorage.removeItem('maxdata_listings');
              window.location.reload();
            }}
          >
            Clear Listings
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
