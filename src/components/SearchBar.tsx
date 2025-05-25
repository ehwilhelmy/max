
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search Max Data"
        className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
      />
    </div>
  );
};

export default SearchBar;
