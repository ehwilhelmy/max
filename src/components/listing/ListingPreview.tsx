import { ListingData } from '@/pages/NewListing';
import { Bed, Bath, Ruler, Calendar } from 'lucide-react';

interface ListingPreviewProps {
  data: ListingData;
  photos?: (string | ArrayBuffer | null)[];
}

const ListingPreview = ({ data, photos = [] }: ListingPreviewProps) => {
  // Use the first photo as the main image, others as thumbnails
  const mainPhoto = photos[0] || '/lovable-uploads/48460631-53a0-4b6a-876a-df1092f51194.png';
  const thumbnails = photos.slice(1, 4);
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Property image */}
      <div className="relative">
        <img 
          src={mainPhoto as string}
          alt="Property"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {/* Thumbnails row */}
        <div className="flex gap-2 absolute left-4 -bottom-7">
          {[mainPhoto, ...thumbnails].slice(0, 3).map((thumb, idx) => (
            <img
              key={idx}
              src={thumb as string}
              alt={`Thumbnail ${idx + 1}`}
              className="w-20 h-14 object-cover rounded border bg-white"
              style={{ zIndex: 3 - idx, marginLeft: idx === 0 ? 0 : -12 }}
            />
          ))}
          {photos.length < 3 &&
            Array.from({ length: 3 - photos.length }).map((_, idx) => (
              <div key={idx} className="w-20 h-14 rounded border bg-gray-100" />
            ))}
        </div>
      </div>

      <div className="p-4 pt-8">
        {/* Address */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {data.address.split(',')[0] || '123 Main St'}
        </h3>
        <p className="text-blue-700 font-medium mb-4">
          {data.address.includes(',') ? data.address.split(',').slice(1).join(',').trim() : 'Miami, Florida 12321'}
        </p>

        {/* Property details */}
        <div className="flex items-center gap-6 text-base text-gray-700 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-5 h-5 text-blue-700" />
            <span>{data.bedrooms || '3'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-5 h-5 text-blue-700" />
            <span>{data.bathrooms || '3'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-5 h-5 text-blue-700" />
            <span>{data.livingArea || '1200 sq ft'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-5 h-5 text-blue-700" />
            <span>{data.yearBuilt || '2012'}</span>
          </div>
        </div>

        {/* Map section */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Map view</h4>
          <div className="w-full h-24 bg-green-100 rounded border relative">
            <div className="absolute inset-0 flex items-center justify-center text-green-700 text-xs">
              Map placeholder
            </div>
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              55
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-600">
              Campbellfield
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPreview;
