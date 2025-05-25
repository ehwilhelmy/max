import { useState, useRef } from 'react';
import { ArrowLeft, Calendar, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewForm from '@/components/listing/OverviewForm';
import DetailsForm from '@/components/listing/DetailsForm';
import ListingPreview from '@/components/listing/ListingPreview';
import demoPhotos from '../demoPhotos.json';

export interface ListingData {
  address: string;
  bedrooms: string;
  bathrooms: string;
  livingArea: string;
  lotArea: string;
  yearBuilt: string;
  propertyType: string;
  price: string;
  listingDates: string;
  status: string;
  unique: string;
  description: string;
}

const NewListing = () => {
  const location = useLocation();
  const initialListing = location.state && location.state.listing ? location.state.listing : {
    address: '123 Main St, Miami FL',
    bedrooms: '3',
    bathrooms: '3',
    livingArea: '3,000 sqft',
    lotArea: '.5 acre',
    yearBuilt: '2012',
    propertyType: 'Home',
    price: '',
    listingDates: '',
    status: 'Draft',
    unique: '',
    description: '',
  };
  const initialPhotos = (location.state && location.state.listing && location.state.listing.photos && location.state.listing.photos.length > 0)
    ? location.state.listing.photos
    : [];
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [listingData, setListingData] = useState<ListingData>(initialListing);
  const [photos, setPhotos] = useState<(string | ArrayBuffer | null)[]>(
    initialPhotos.length > 0 ? initialPhotos : demoPhotos
  );
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPhotos(prev => [...prev, ev.target?.result || null]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleReplacePhoto = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(prev => prev.map((photo, i) => i === index ? ev.target?.result || null : photo));
      };
      reader.readAsDataURL(file);
    }
  };

  const getMissingFields = (tab: 'overview' | 'details') => {
    if (tab === 'overview') {
      const requiredFields = ['price', 'listingDates'];
      return requiredFields.filter(field => !listingData[field as keyof ListingData]);
    } else {
      // For details tab, we can add more required fields later
      return [];
    }
  };

  const overviewMissingCount = getMissingFields('overview').length;
  const detailsMissingCount = getMissingFields('details').length;

  function getRandomString() {
    return Math.random().toString(36).substring(2, 10) + Date.now();
  }

  const getPicsumPhotos = (address: string) => {
    return [1, 2, 3].map(i => `https://picsum.photos/seed/${encodeURIComponent(address + '-' + i)}/600/400`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/ask-max" className="flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-800 font-medium">MAX DATA</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">New Listing</span>
              </div>
            </div>
            <Button 
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/ask-max">
                <span className="mr-2 text-blue-500">✨</span>
                Ask MAX
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form section */}
          <div
            className={`transition-all duration-500 ease-in-out ${showPreview && !previewExpanded ? 'md:w-2/3 w-full' : 'w-full'} ${previewExpanded ? 'hidden md:block w-0' : ''}`}
            style={{ transitionProperty: 'width, flex, opacity' }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="overview" className="relative">
                  Overview
                  {overviewMissingCount > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      {overviewMissingCount} missing fields
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="details" className="relative">
                  Details
                  {detailsMissingCount > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      {detailsMissingCount} missing fields
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewForm 
                  data={listingData} 
                  onChange={setListingData}
                  missingFields={getMissingFields('overview')}
                />
              </TabsContent>

              <TabsContent value="details">
                <DetailsForm 
                  data={listingData} 
                  onChange={setListingData}
                  missingFields={getMissingFields('details')}
                />
              </TabsContent>
            </Tabs>

            {/* Photos section - moved here */}
            <div className="mb-8 mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Photos</span>
                <input
                  id="listing-photos-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={photoInputRef}
                  onChange={handleAddPhotos}
                />
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  asChild={false}
                  onClick={() => photoInputRef.current && photoInputRef.current.click()}
                >
                  <ImageIcon className="w-4 h-4" /> Add photos
                </Button>
              </div>
              <div className="flex flex-wrap gap-6">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative w-72 h-56 rounded-xl overflow-hidden group bg-gray-100">
                    {photo && (
                      <img src={photo as string} alt={`Listing photo ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleReplacePhoto(idx, e)} />
                      <span className="text-white bg-black/60 rounded px-3 py-2 text-sm">replace photo</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row justify-between mt-8 pt-6 border-t">
              <Button variant="outline" className="mb-4 md:mb-0">
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => {
                  // Save as draft
                  const listings = JSON.parse(localStorage.getItem('maxdata_listings') || '[]');
                  const picsumPhotos = getPicsumPhotos(listingData.address);
                  const isDemoPhotos = photos.length === demoPhotos.length && photos.every((p, i) => p === demoPhotos[i]);
                  const finalPhotos = (!photos || photos.length === 0 || isDemoPhotos) ? picsumPhotos : photos;
                  listings.push({ ...listingData, photos: finalPhotos, status: 'Draft' });
                  localStorage.setItem('maxdata_listings', JSON.stringify(listings));
                  window.location.href = '/';
                }}>
                  Save as draft
                </Button>
                <Button onClick={() => {
                  // Save & Publish
                  const listings = JSON.parse(localStorage.getItem('maxdata_listings') || '[]');
                  const picsumPhotos = getPicsumPhotos(listingData.address);
                  const isDemoPhotos = photos.length === demoPhotos.length && photos.every((p, i) => p === demoPhotos[i]);
                  const finalPhotos = (!photos || photos.length === 0 || isDemoPhotos) ? picsumPhotos : photos;
                  listings.push({ ...listingData, photos: finalPhotos, status: 'Published' });
                  localStorage.setItem('maxdata_listings', JSON.stringify(listings));
                  window.location.href = '/?published=1';
                }}>
                  Save & Publish
                </Button>
              </div>
            </div>
          </div>

          {/* Preview section (always visible, can expand/collapse) */}
          <div
            className={`transition-all duration-500 ease-in-out ${previewExpanded ? 'w-full' : 'md:w-1/3 w-full'}`}
            style={{ transitionProperty: 'width, flex, opacity' }}
          >
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Preview listing</h3>
                <div className="flex gap-2">
                  {!previewExpanded && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewExpanded(true)}
                      aria-label="Expand preview"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  )}
                  {previewExpanded && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewExpanded(false)}
                      aria-label="Collapse preview"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <ListingPreview data={listingData} photos={photos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewListing;
