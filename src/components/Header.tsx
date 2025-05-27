import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';

const Header = ({ cartCount = 0 }: { cartCount?: number }) => {
  const [open, setOpen] = useState(false);

  // Get all published listings with cart items
  let listingsWithCart: any[] = [];
  let totalCartCount = 0;
  if (typeof window !== 'undefined') {
    const listings = JSON.parse(localStorage.getItem('maxdata_listings') || '[]');
    listingsWithCart = listings.filter((l: any) => l.status === 'Published' && Array.isArray(l.cart) && l.cart.length > 0);
    totalCartCount = listingsWithCart.reduce((sum, l) => sum + (Array.isArray(l.cart) ? l.cart.length : 0), 0);
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/816a47f0-4c10-415f-a4d8-9b25448f3334.png" 
                alt="MAX DATA" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right side - Ask MAX button, cart, and user profile */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/ask-max">
                <span className="mr-2">✨</span>
                Ask MAX
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalCartCount}
                    </span>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="max-h-[90vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Cart</SheetTitle>
                  <SheetDescription>
                    {listingsWithCart.length > 0 ? (
                      <div className="space-y-8 mt-4">
                        {listingsWithCart.map((listing, idx) => {
                          const cart = listing.cart || [];
                          const total = cart.reduce((sum: number, item: string) => sum + (item === 'syndicate' ? 0 : item === 'video' || item === 'social' ? 20 : 50), 0);
                          return (
                            <div key={idx} className="border-b pb-4">
                              <div className="font-semibold text-lg mb-1">{listing.address}</div>
                              <div className="text-gray-500 text-sm mb-1">{listing.price ? `$${listing.price}` : ''}</div>
                              <div className="font-semibold mb-2 mt-2">Boosts</div>
                              <ul className="space-y-2">
                                {cart.includes('syndicate') && <li className="flex justify-between"><span>Syndicate to all partners</span><span className="font-bold text-green-600">$0</span></li>}
                                {cart.includes('video') && <li className="flex justify-between"><span>Create a Gen AI listing video</span><span className="font-bold">$20</span></li>}
                                {cart.includes('social') && <li className="flex justify-between"><span>Boost with a social media campaign</span><span className="font-bold">$20</span></li>}
                                {cart.includes('print') && <li className="flex justify-between"><span>Create print materials</span><span className="font-bold">$50</span></li>}
                              </ul>
                              <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                                <span>Total</span>
                                <span>${total}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500 mt-8">No published listings with boosts found.</div>
                    )}
                  </SheetDescription>
                </SheetHeader>
                <SheetClose asChild>
                  <Button className="w-full mt-8" variant="default" onClick={() => alert('Checkout coming soon!')}>Checkout</Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                  JW
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 hidden sm:inline">Joe Wilhelmy</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
