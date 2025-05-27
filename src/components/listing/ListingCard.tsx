import { Bed, Bath, Ruler, Home, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import demoPhotos from '../../demoPhotos.json';

interface ListingCardProps {
  listing: any;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const mainPhoto = listing.photos && listing.photos[0];
  const status = listing.status || 'Draft';
  // Parse address
  const [street, ...rest] = (listing.address || '').split(',');
  const cityStateZip = rest.join(',').trim();
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 w-full h-full relative">
      {/* Photo */}
      <div className="w-full flex-shrink-0">
        <img
          src={mainPhoto}
          alt="Listing"
          className="w-full h-48 object-cover rounded-xl"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = demoPhotos[0];
          }}
        />
      </div>
      {/* Details */}
      <div className="flex-1 flex flex-col justify-between w-full h-full mt-4">
        <div className="flex items-start justify-between w-full">
          <span className={
            `${(status === 'Published' || status === 'Success') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} text-xs font-semibold px-3 py-1 rounded mb-2`
          }>
            {status}
          </span>
          <div className="relative">
            <button className="text-gray-400 hover:text-gray-600 p-1" onClick={() => setMenuOpen(v => !v)}>
              <MoreVertical className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setMenuOpen(false); navigate('/new-listing', { state: { listing } }); }}>Edit</button>
                {status === 'Published' && (
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setMenuOpen(false); /* TODO: Move to Draft action */ }}>Move to Draft</button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="font-bold text-lg text-blue-900 leading-tight">{street}</div>
          <div className="text-blue-900 text-base mb-1">{cityStateZip}</div>
          <div className="font-bold text-xl text-blue-900 mb-2">{listing.price || '—'}</div>
          <div className="flex flex-wrap items-center gap-6 text-base text-blue-900 mb-2">
            <div className="flex items-center gap-1"><Bed className="w-5 h-5" /><span>{listing.bedrooms}</span></div>
            <div className="flex items-center gap-1"><Bath className="w-5 h-5" /><span>{listing.bathrooms}</span></div>
            <div className="flex items-center gap-1"><Ruler className="w-5 h-5" /><span>{listing.livingArea}</span></div>
            <div className="flex items-center gap-1"><Home className="w-5 h-5" /><span>{listing.yearBuilt}</span></div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-blue-900 mt-2 w-full">
          <div>
            <div>Contract date</div>
            <div>Last updated</div>
          </div>
          <div className="text-right">
            <div>{listing.listingDates || '—'}</div>
            <div>{listing.lastUpdated || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard; 