
import { ListingData } from '@/pages/NewListing';

interface DetailsFormProps {
  data: ListingData;
  onChange: (data: ListingData) => void;
  missingFields: string[];
}

const DetailsForm = ({ data, onChange, missingFields }: DetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <p className="text-gray-500">Details form coming soon...</p>
        <p className="text-sm text-gray-400 mt-2">4 missing fields</p>
      </div>
    </div>
  );
};

export default DetailsForm;
