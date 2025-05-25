import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { ListingData } from '@/pages/NewListing';

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
        <div className={`flex items-center space-x-2 p-3 border rounded-md ${isMissing('listingDates') ? 'border-red-500' : 'border-gray-300'}`}>
          <Calendar className="w-4 h-4 text-gray-500" />
          <Input
            id="listingDates"
            placeholder="Select dates"
            value={data.listingDates}
            onChange={(e) => updateField('listingDates', e.target.value)}
            className="border-0 p-0 focus:ring-0"
          />
        </div>
        {isMissing('listingDates') && (
          <p className="text-red-600 text-sm">Missing data</p>
        )}
      </div>
    </div>
  );
};

export default OverviewForm;
