import { ListingData } from '@/pages/NewListing';
import { Bed, Bath, Ruler, Calendar } from 'lucide-react';

interface ListingPreviewProps {
  data: ListingData;
  photos?: (string | ArrayBuffer | null)[];
}

const ListingPreview = ({ data, photos = [] }: ListingPreviewProps) => {
  const hasPhotos = photos && photos.length > 0 && photos.some(Boolean);
  const mainPhoto = hasPhotos ? photos[0] : '/lovable-uploads/48460631-53a0-4b6a-876a-df1092f51194.png';
  const thumbnails = hasPhotos ? photos.slice(1, 4) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Property image or Add Photos notification */}
      <div className="relative">
        {hasPhotos ? (
          <>
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
                />
              ))}
              {photos.length < 3 &&
                Array.from({ length: 3 - photos.length }).map((_, idx) => (
                  <div key={idx} className="w-20 h-14 rounded border bg-gray-100" />
                ))}
            </div>
          </>
        ) : (
          <button
            type="button"
            className="w-full h-48 flex items-center justify-center bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-t-lg text-base font-medium cursor-pointer hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            onClick={() => {
              const el = document.getElementById('listing-photos-upload');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (el as HTMLInputElement).focus();
              }
            }}
            aria-label="Go to add photos field"
          >
            <span>Add photos to make your listing stand out!</span>
          </button>
        )}
      </div>

      <div className="p-4 pt-8">
        {/* Address */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {data.address.split(',')[0] || '123 Main St'}
        </h3>
        <p className="text-blue-700 font-medium mb-4">
          {data.address.includes(',') ? data.address.split(',').slice(1).join(',').trim() : 'Miami, Florida 12321'}
        </p>

        {/* Price */}
        <div className="text-2xl font-bold text-blue-700 mb-4">
          {data.price ? `$${data.price.replace(/^\$+/, '')}` : 'Price on request'}
        </div>

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

        {/* Description */}
        {data.description ? (
          <p className="mb-4 text-gray-700 text-base whitespace-pre-line">{data.description}</p>
        ) : (
          <button
            type="button"
            className="mb-4 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-base w-full text-left cursor-pointer hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            onClick={() => {
              const el = document.getElementById('listing-description');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (el as HTMLTextAreaElement).focus();
              }
            }}
            aria-label="Go to description field"
          >
            <span className="font-medium">No description:</span> Add a compelling property description to attract buyers!
          </button>
        )}

        {/* Map section */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Map view</h4>
          <div className="w-full h-24 rounded border relative overflow-hidden bg-gray-100">
            {data.address ? (
              <img
                src={`https://static-maps.yandex.ru/1.x/?lang=en-US&ll=0,0&z=10&l=map&size=450,100&pt=0,0,pm2rdm`}
                alt="Map preview"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(0.2)' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-green-700 text-xs">
                Map unavailable
              </div>
            )}
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
