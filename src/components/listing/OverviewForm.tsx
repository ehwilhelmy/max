import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Sparkles } from 'lucide-react';
import { ListingData } from '@/pages/NewListing';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface OverviewFormProps {
  data: ListingData;
  onChange: (data: ListingData) => void;
  missingFields: string[];
}

const OverviewForm = ({ data, onChange, missingFields }: OverviewFormProps) => {
  const updateField = (field: keyof ListingData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isMissing = (field: string) => missingFields.includes(field);

  // Helper to check if a date string is valid
  function isValidDateString(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
  }

  return (
    <div className="space-y-6">
      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => updateField('address', e.target.value)}
          className="bg-gray-50"
        />
        <Button variant="link" className="p-0 h-auto text-blue-600">
          Change address
        </Button>
      </div>

      {/* Bedrooms and Bathrooms row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            value={data.bedrooms}
            onChange={(e) => updateField('bedrooms', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            value={data.bathrooms}
            onChange={(e) => updateField('bathrooms', e.target.value)}
          />
        </div>
      </div>

      {/* Living area and Lot area row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="livingArea">Living area (sqft)</Label>
          <Input
            id="livingArea"
            value={data.livingArea}
            onChange={(e) => updateField('livingArea', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lotArea">Lot area (sqft)</Label>
          <Input
            id="lotArea"
            value={data.lotArea}
            onChange={(e) => updateField('lotArea', e.target.value)}
          />
        </div>
      </div>

      {/* Year built and Property type row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year built</Label>
          <Input
            id="yearBuilt"
            value={data.yearBuilt}
            onChange={(e) => updateField('yearBuilt', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property type</Label>
          <Select value={data.propertyType} onValueChange={(value) => updateField('propertyType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <Input
            id="price"
            placeholder="Enter price"
            value={data.price}
            onChange={(e) => updateField('price', e.target.value)}
            className={`pl-3 ${isMissing('price') ? 'border-red-500' : ''}`}
          />
          <Select defaultValue="USD">
            <SelectTrigger className="absolute right-1 top-1 bottom-1 w-20 border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isMissing('price') && (
          <p className="text-red-600 text-sm">Missing data</p>
        )}
      </div>

      {/* Listing contract dates */}
      <div className="space-y-2">
        <Label htmlFor="listingDates">Listing contract dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${isMissing('listingDates') ? 'border-red-500' : ''}`}
            >
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              {isValidDateString(data.listingDates)
                ? format(new Date(data.listingDates), 'PPP')
                : <span className="text-gray-400">Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DatePicker
              mode="single"
              selected={isValidDateString(data.listingDates) ? new Date(data.listingDates) : undefined}
              onSelect={date => {
                if (date) updateField('listingDates', date.toISOString());
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {isMissing('listingDates') && (
          <p className="text-red-600 text-sm">Missing data</p>
        )}
      </div>

      {/* Description with AI generator */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="listing-description"
          className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 bg-gray-50"
          value={data.description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Enter a compelling property description..."
        />
        <Button
          type="button"
          variant="outline"
          className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={() => {
            // Mock AI call: generate a description based on form data
            const desc = `Welcome to ${data.address}! This beautiful ${data.bedrooms}-bed, ${data.bathrooms}-bath ${data.propertyType.toLowerCase()} offers ${data.livingArea} of living space on a ${data.lotArea} lot. Built in ${data.yearBuilt}, it combines modern comfort with timeless charm. Schedule a tour today!`;
            updateField('description', desc);
          }}
        >
          <Sparkles className="inline w-4 h-4 mr-2 text-blue-400" /> Generate with AI
        </Button>
      </div>
    </div>
  );
};

export default OverviewForm;
