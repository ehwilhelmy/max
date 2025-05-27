import { useState, useRef } from 'react';
import { ArrowLeft, Calendar, Image as ImageIcon, Maximize2, Minimize2, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewForm from '@/components/listing/OverviewForm';
import DetailsForm from '@/components/listing/DetailsForm';
import ListingPreview from '@/components/listing/ListingPreview';
import demoPhotos from '../demoPhotos.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';

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
  const navigate = useNavigate();
  const defaultListing: ListingData = {
    address: location.state && location.state.address ? location.state.address : '123 Main St, Miami FL',
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
  let initialListing: ListingData;
  let initialPhotos: (string | ArrayBuffer | null)[] = [];
  if (location.state && location.state.listing) {
    const incoming = location.state.listing;
    let fixedListing = { ...defaultListing, ...incoming };
    // Fix listingDates if it's a range string
    if (fixedListing.listingDates && typeof fixedListing.listingDates === 'string' && fixedListing.listingDates.includes(' - ')) {
      const [start] = fixedListing.listingDates.split(' - ');
      const parsed = new Date(start);
      if (!isNaN(parsed.getTime())) {
        fixedListing.listingDates = parsed.toISOString();
      }
    }
    initialListing = fixedListing;
    initialPhotos = Array.isArray(incoming.photos) && incoming.photos.length > 0 ? incoming.photos : [];
  } else {
    initialListing = defaultListing;
    initialPhotos = [];
  }
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [listingData, setListingData] = useState<ListingData>(initialListing);
  const [photos, setPhotos] = useState<(string | ArrayBuffer | null)[]>(
    initialPhotos.length > 0 ? initialPhotos : demoPhotos
  );
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [publishError, setPublishError] = useState('');
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [cart, setCart] = useState<string[]>([]);

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
  const hasMissingRequired = overviewMissingCount > 0 || detailsMissingCount > 0;

  function getRandomString() {
    return Math.random().toString(36).substring(2, 10) + Date.now();
  }

  // Deterministically pick 3 demo photos based on address
  const getPicsumPhotos = (address: string) => {
    // Use the address string to generate a hash
    const hash = Math.abs(address.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    // Pick 3 demo photos, rotating through the demoPhotos array
    const total = demoPhotos.length;
    return [0, 1, 2].map(i => demoPhotos[(hash + i) % total]);
  };

  const toggleCartItem = (item: string) => {
    setCart(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)} aria-label="Go back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-gray-800 font-medium">MAX DATA</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">New Listing</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
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
                {photos.slice(0, 3).map((photo, idx) => (
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
                  setPublishError('');
                  const listings = JSON.parse(localStorage.getItem('maxdata_listings') || '[]');
                  const picsumPhotos = getPicsumPhotos(listingData.address);
                  const isDemoPhotos = photos.length === demoPhotos.length && photos.every((p, i) => p === demoPhotos[i]);
                  let finalPhotos = (!photos || photos.length === 0 || isDemoPhotos) ? picsumPhotos : photos;
                  // Always only save 3 photos
                  finalPhotos = finalPhotos.slice(0, 3);
                  listings.push({ ...listingData, photos: finalPhotos, status: 'Draft' });
                  localStorage.setItem('maxdata_listings', JSON.stringify(listings));
                  window.location.href = '/';
                }}>
                  Save as draft
                </Button>
                <Button
                  onClick={() => {
                    if (hasMissingRequired) {
                      setPublishError('Please fill in all required fields before publishing.');
                      return;
                    }
                    setPublishError('');
                    setShowBoostModal(true);
                  }}
                  disabled={hasMissingRequired}
                >
                  Save & Publish
                </Button>
              </div>
              {publishError && (
                <div className="text-red-600 mt-4 text-sm">{publishError}</div>
              )}
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

      <Dialog open={showBoostModal} onOpenChange={setShowBoostModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">BOOST YOUR REACH!</DialogTitle>
            <DialogDescription className="text-center mb-4">
              Post your listing to all our syndication partners and unlock more marketing options.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <div className="font-semibold">Syndicate to all partners</div>
                <div className="text-sm text-gray-500">Post your listings to all our syndication partners</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-600">$0</span>
                <Button variant="outline" size="sm" onClick={() => toggleCartItem('syndicate')}>
                  <ShoppingCart className="w-4 h-4 mr-1" /> {cart.includes('syndicate') ? 'Remove' : 'Add to cart'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <div className="font-semibold">Create a Gen AI listing video</div>
                <div className="text-sm text-gray-500">Engage buyers with a custom AI video</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">$20</span>
                <Button variant="outline" size="sm" onClick={() => toggleCartItem('video')}>
                  <ShoppingCart className="w-4 h-4 mr-1" /> {cart.includes('video') ? 'Remove' : 'Add to cart'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <div className="font-semibold">Boost with a social media campaign</div>
                <div className="text-sm text-gray-500">Reach more buyers on social media</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">$20</span>
                <Button variant="outline" size="sm" onClick={() => toggleCartItem('social')}>
                  <ShoppingCart className="w-4 h-4 mr-1" /> {cart.includes('social') ? 'Remove' : 'Add to cart'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <div className="font-semibold">Create print materials</div>
                <div className="text-sm text-gray-500">Get beautiful flyers and brochures</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">$50</span>
                <Button variant="outline" size="sm" onClick={() => toggleCartItem('print')}>
                  <ShoppingCart className="w-4 h-4 mr-1" /> {cart.includes('print') ? 'Remove' : 'Add to cart'}
                </Button>
              </div>
            </div>
          </div>
          {cart.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Cart Summary</h3>
              <ul className="space-y-2">
                {cart.includes('syndicate') && <li className="flex justify-between"><span>Syndicate to all partners</span><span className="font-bold text-green-600">$0</span></li>}
                {cart.includes('video') && <li className="flex justify-between"><span>Create a Gen AI listing video</span><span className="font-bold">$20</span></li>}
                {cart.includes('social') && <li className="flex justify-between"><span>Boost with a social media campaign</span><span className="font-bold">$20</span></li>}
                {cart.includes('print') && <li className="flex justify-between"><span>Create print materials</span><span className="font-bold">$50</span></li>}
              </ul>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>${cart.reduce((sum, item) => sum + (item === 'syndicate' ? 0 : item === 'video' || item === 'social' ? 20 : 50), 0)}</span>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button className="w-full flex items-center justify-center" onClick={() => {
                const listings = JSON.parse(localStorage.getItem('maxdata_listings') || '[]');
                const picsumPhotos = getPicsumPhotos(listingData.address);
                const isDemoPhotos = photos.length === demoPhotos.length && photos.every((p, i) => p === demoPhotos[i]);
                let finalPhotos = (!photos || photos.length === 0 || isDemoPhotos) ? picsumPhotos : photos;
                finalPhotos = finalPhotos.slice(0, 3);
                listings.push({ ...listingData, photos: finalPhotos, status: 'Published', cart });
                localStorage.setItem('maxdata_listings', JSON.stringify(listings));
                window.location.href = '/?published=1';
              }}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Done ({cart.length})
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewListing;
