import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import demoPhotos from '@/demoPhotos.json';

const DUMMY_LISTING = {
  address: '',
  bedrooms: '3',
  bathrooms: '2',
  livingArea: '2,100 sqft',
  yearBuilt: '2015',
  propertyType: 'Home',
  price: '',
  listingDates: '',
  photos: [
    '/lovable-uploads/48460631-53a0-4b6a-876a-df1092f51194.png',
    '/lovable-uploads/816a47f0-4c10-4a7e-8e2e-2e7e2e2e2e2e.png',
    '/lovable-uploads/48460631-53a0-4b6a-876a-df1092f51194.png',
  ],
};

const AskMax = () => {
  const [step, setStep] = useState<'prompt' | 'chat'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [listing, setListing] = useState<any>(DUMMY_LISTING);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [showContinue, setShowContinue] = useState(false);
  const [awaitingFinalConfirm, setAwaitingFinalConfirm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const mockAddresses = [
    '123 Main St, Miami FL',
    '456 Oak Ave, Orlando FL',
    '789 Pine Rd, Tampa FL',
    '101 Maple Dr, Jacksonville FL',
    '202 Elm St, St. Petersburg FL',
  ];
  const navigate = useNavigate();

  const suggestions = [
    'offer a referral client',
    'create pre listing presentation', 
    'create a coming soon listing'
  ];

  const REQUIRED_FIELDS = ['price', 'listingDates'];

  const homeKeywords = ['house', 'living room', 'kitchen', 'bedroom'];
  function getHomePhotos(address: string) {
    const unique = encodeURIComponent(address || Date.now());
    return homeKeywords.map((kw, i) => `https://source.unsplash.com/600x400/?${encodeURIComponent(kw)}&sig=${unique}-${i}`);
  }

  function getDemoPhotos(address: string) {
    const hash = Math.abs(address.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    return [
      demoPhotos[hash % demoPhotos.length],
      demoPhotos[(hash + 1) % demoPhotos.length],
      demoPhotos[(hash + 2) % demoPhotos.length]
    ];
  }

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setStep('chat');
    // Use selected suggestion if available, else parse address
    const address = selectedSuggestion || extractAddress(prompt);
    // Use curated demo photos for this listing
    const photos = getDemoPhotos(address);
    // Set up dummy listing with parsed address and demo photos
    const newListing = { ...DUMMY_LISTING, address, photos };
    setListing(newListing);
    // Add agent's message
    setConversation([
      { sender: 'agent', text: prompt },
      { sender: 'max', type: 'details', listing: newListing }
    ]);
    // Find missing fields
    const missing = REQUIRED_FIELDS.filter(f => !newListing[f]);
    setMissingFields(missing);
    if (missing.length > 0) {
      setCurrentField(missing[0]);
      setConversation(prev => ([
        ...prev,
        { sender: 'max', type: 'ask', field: missing[0] }
      ]));
    } else {
      setShowContinue(true);
    }
  };

  const handleChatInput = (e: React.FormEvent, value?: string) => {
    e.preventDefault();
    const answer = value || chatInput;
    if (!answer.trim()) return;
    // If awaiting final confirmation, show agent's reply, then MAX's summary and continue
    if (awaitingFinalConfirm) {
      setConversation(prev => ([...prev, { sender: 'agent', text: answer }]));
      setTimeout(() => {
        setAwaitingFinalConfirm(false);
        setShowContinue(true);
        setConversation(prev => ([
          ...prev,
          { sender: 'max', type: 'summary', listing }
        ]));
      }, 200); // slight delay to ensure agent's reply is rendered first
      setChatInput('');
      return;
    }
    if (!currentField) return;
    // Add agent's reply
    setConversation(prev => ([...prev, { sender: 'agent', text: answer }]));
    // Update listing
    const updated = { ...listing, [currentField]: answer };
    setListing(updated);
    // Find next missing field
    const stillMissing = missingFields.filter(f => f !== currentField).filter(f => !updated[f]);
    setMissingFields(stillMissing);
    setChatInput('');
    if (stillMissing.length > 0) {
      setCurrentField(stillMissing[0]);
      setConversation(prev => ([
        ...prev,
        { sender: 'max', type: 'ask', field: stillMissing[0] }
      ]));
    } else {
      setCurrentField(null);
      setAwaitingFinalConfirm(true);
      setConversation(prev => ([
        ...prev,
        { sender: 'max', type: 'finalConfirm' }
      ]));
    }
  };

  const handleContinue = () => {
    navigate('/new-listing', { state: { listing } });
  };

  // Helper to parse address from prompt
  function extractAddress(prompt: string) {
    const match = prompt.match(/create (a )?listing for (.+)/i);
    if (match && match[2]) {
      return match[2].trim();
    }
    return prompt.trim();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-medium">MAX DATA</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Ask MAX</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="mb-6 mt-8 flex flex-col items-center">
          <img src="/max-flag.png" alt="MAX Flag" className="w-6 h-6 mb-2" />
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Ask MAX</h1>
          <p className="text-gray-500 text-lg mb-10">Let MAX help build your listing with a few questions!</p>
            </div>
        {step === 'prompt' && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-0 mb-8 relative">
            <form onSubmit={handlePromptSubmit} autoComplete="off">
              <div className="flex flex-col gap-0">
                <div className="flex items-center px-6 pt-6 pb-2">
                  <img src="/max-flag.png" alt="MAX Flag" className="w-5 h-5 mr-3" />
                  <span className="text-base text-gray-900 font-medium">Enter a location you want to list</span>
          </div>
                <div className="flex items-center px-6 pb-6 pt-2 relative">
                  <Input
                    type="text"
                    placeholder="Search for a location..."
                    value={prompt}
                    onChange={e => {
                      setPrompt(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="flex-1 bg-gray-50 border-0 text-lg placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-100"
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete="off"
                  />
                <Button 
                  type="submit"
                  size="icon"
                    className="ml-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                    disabled={!selectedSuggestion && !prompt}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
                  {/* Suggestions dropdown */}
                  {showSuggestions && prompt && (
                    <div className="absolute left-0 right-0 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {mockAddresses.filter(addr => addr.toLowerCase().includes(prompt.toLowerCase())).length === 0 ? (
                        <div className="px-4 py-2 text-gray-500">No results</div>
                      ) : (
                        mockAddresses.filter(addr => addr.toLowerCase().includes(prompt.toLowerCase())).map((addr, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                            onMouseDown={() => {
                              setPrompt(addr);
                              setSelectedSuggestion(addr);
                              setShowSuggestions(false);
                            }}
                          >
                            {addr}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
        {step === 'chat' && (
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-0 mb-8 flex flex-col items-stretch h-[600px]">
            {/* Chat area, scrollable if needed */}
            <div className="flex-1 flex flex-col justify-end overflow-y-auto px-6 pt-0 pb-2">
              {conversation.map((msg, idx) => {
                if (msg.sender === 'agent') {
                  return (
                    <div key={idx} className="flex justify-end items-start mt-0 mb-2">
                      <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-lg max-w-xs text-right">
                        {msg.text}
                      </div>
                      <img src="/avatar-placeholder.png" alt="Agent Avatar" className="w-8 h-8 rounded-full ml-2 border border-gray-200 object-cover" />
                    </div>
                  );
                }
                if (msg.type === 'details') {
                  return (
                    <div key={idx} className="flex justify-start mb-2">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg max-w-md">
                        <div className="flex items-center mb-2">
                          <img src="/max-flag.png" alt="MAX Flag" className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Thanks! Happy to help, can you first confirm the following listing details for <span className="text-blue-700 font-bold">{listing.address || '[location_name]'}</span>:</span>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3 mt-2 mb-2 bg-white">
                          <div>Bedrooms: {listing.bedrooms}</div>
                          <div>Bathrooms: {listing.bathrooms}</div>
                          <div>Living Area: {listing.livingArea}</div>
                          <div>Year Built: {listing.yearBuilt}</div>
                          <div>Property Type: {listing.propertyType}</div>
                          <div className="flex gap-2 mt-2">
                            {listing.photos.map((photo: string, idx: number) => (
                              <div key={idx} className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                <img src={photo} alt="Preview" className="object-cover w-full h-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (msg.type === 'ask') {
                  let label = msg.field === 'price' ? 'What is the listing price?' : 'What are the listing contract dates?';
                  return (
                    <div key={idx} className="flex justify-start mb-2">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg max-w-md">
                        <div className="flex items-center mb-2">
                          <img src="/max-flag.png" alt="MAX Flag" className="w-5 h-5 mr-2" />
                          <span className="font-semibold">{label}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (msg.type === 'finalConfirm') {
                  return (
                    <div key={idx} className="flex justify-start mb-2">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg max-w-md">
                        <div className="flex items-center mb-2">
                          <img src="/max-flag.png" alt="MAX Flag" className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Does everything look good, or would you like to make any changes before creating the listing?</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (msg.type === 'summary') {
                  return (
                    <div key={idx} className="flex justify-start mb-2">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg max-w-md">
                        <div className="flex items-center mb-2">
                          <img src="/max-flag.png" alt="MAX Flag" className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Looks great! Here's your completed listing for <span className="text-blue-700 font-bold">{listing.address}</span>. Ready to create the listing?</span>
                        </div>
              </div>
            </div>
                  );
                }
                return null;
              })}
            </div>
            {/* MAX is waiting bar and chat input anchored to bottom */}
            {showContinue ? (
              <div className="w-full border-t border-gray-200 px-0 pb-0 flex flex-col">
                <div className="w-full bg-blue-900 text-white flex items-center gap-2 px-6 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2 text-white" />
                  All set! Ready to continue.
                </div>
                <div className="px-6 py-4 flex items-center gap-2 justify-end">
                  <Button onClick={handleContinue} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Continue</Button>
                </div>
              </div>
            ) : (
              <div className="w-full border-t border-gray-200 px-0 pb-0 flex flex-col">
                {/* Suggestion logic for price and contract dates - now above blue bar */}
                {currentField === 'price' && (
                  <div className="px-6 pt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-gray-600 text-sm mr-2">Suggested:</span>
                    {[410000, 420000, 430000].map((price, idx) => (
                <Button
                        key={price}
                  variant="outline"
                        className="rounded-full border-gray-300 text-blue-700 bg-white hover:bg-blue-50 px-4 py-1 shadow-sm"
                        onClick={e => handleChatInput(e, `$${price.toLocaleString()}`)}
                >
                        {`$${price.toLocaleString()}`}
                </Button>
              ))}
                    <Button
                      variant="outline"
                      className="rounded-full border-gray-300 text-gray-700 bg-white hover:bg-blue-50 px-4 py-1 shadow-sm"
                      onClick={() => {
                        const input = document.getElementById('max-chat-input');
                        if (input) input.focus();
                      }}
                    >
                      Other
                    </Button>
                  </div>
                )}
                {currentField === 'listingDates' && (
                  <div className="px-6 pt-4 flex items-center gap-2">
                    <span className="text-gray-600 text-sm mr-2">Suggested:</span>
                    <Button
                      variant="outline"
                      className="rounded-full border-gray-300 text-blue-700 bg-white hover:bg-blue-50 px-4 py-1 shadow-sm"
                      onClick={e => {
                        const today = format(new Date(), 'MMM d, yyyy');
                        const end = format(addDays(new Date(), 30), 'MMM d, yyyy');
                        handleChatInput(e, `${today} - ${end}`);
                      }}
                    >
                      {`${format(new Date(), 'MMM d, yyyy')} - ${format(addDays(new Date(), 30), 'MMM d, yyyy')}`}
                    </Button>
                  </div>
                )}
                {/* Blue bar always below suggestions */}
                <div className="w-full bg-blue-900 text-white flex items-center gap-2 px-6 py-2 text-sm font-medium mt-0">
                  <Sparkles className="w-4 h-4 mr-2 text-white" />
                  MAX is waiting on reply
                </div>
                <form onSubmit={handleChatInput} className="px-6 py-4 flex items-center gap-2">
                  <Input
                    id="max-chat-input"
                    type="text"
                    placeholder="Reply to MAX..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" className="bg-blue-100 text-blue-700" type="submit"><ArrowRight /></Button>
                </form>
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AskMax;

