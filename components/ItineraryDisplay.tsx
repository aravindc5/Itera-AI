import React, { useState, useRef, useEffect } from 'react';
import { ItineraryPlan, WeatherInfo, Activity, ItineraryDay } from '../types.ts';
import { SunIcon, PartlyCloudyIcon, CloudIcon, RainIcon, ThunderstormIcon } from '../constants.tsx';

interface ItineraryDisplayProps {
  plan: ItineraryPlan;
  destination: string;
  startDate: string;
  onReset: () => void;
  onSwapActivity: (dayIndex: number, activityIndex: number, day: ItineraryDay, activityToSwap: Activity) => Promise<void>;
}

// --- MOCK DATA & HELPERS FOR CURRENCY CONVERSION ---
const MOCK_RATES: Record<string, Record<string, number>> = {
  'EUR': { 'USD': 1.08, 'GBP': 0.85, 'JPY': 169.50, 'INR': 90.15, 'EUR': 1 },
  'JPY': { 'USD': 0.0064, 'GBP': 0.0051, 'EUR': 0.0059, 'INR': 0.53, 'JPY': 1 },
  'USD': { 'EUR': 0.93, 'GBP': 0.79, 'JPY': 156.45, 'INR': 83.60, 'USD': 1 },
  'GBP': { 'USD': 1.27, 'EUR': 1.18, 'JPY': 198.85, 'INR': 105.75, 'GBP': 1 },
  'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.88, 'INR': 1 },
};
const CURRENCY_SYMBOLS: Record<string, string> = { 'USD': '$', 'GBP': '£', 'EUR': '€', 'JPY': '¥', 'INR': '₹' };
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

// This simulates fetching conversion rates from an API.
const fetchConversionRates = async (baseCurrency: string): Promise<Record<string, number>> => {
  console.log(`Fetching rates for base currency: ${baseCurrency}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_RATES[baseCurrency.toUpperCase()] || MOCK_RATES['USD']);
    }, 500);
  });
};

const convertAndFormatPrice = (
  priceString: string | undefined,
  targetCurrency: string,
  baseCurrency: string,
  rates: Record<string, number> | null
): string => {
  if (!priceString) return 'N/A';
  // Do not convert if no rates are available or if the currency is already the target currency.
  if (!rates || targetCurrency.toUpperCase() === baseCurrency.toUpperCase()) {
    return priceString;
  }

  const rate = rates[targetCurrency.toUpperCase()];
  if (!rate) return priceString; // No conversion rate available for the target currency.

  // Remove commas (thousand separators) to correctly parse numbers.
  const sanitizedString = priceString.replace(/,/g, '');
  const numbers = sanitizedString.match(/\d+(\.\d+)?/g)?.map(Number);

  // If no numbers are found (e.g., "Free"), return the original string.
  if (!numbers || numbers.length === 0) {
    return priceString;
  }

  const convertedNumbers = numbers.map(num => (num * rate).toFixed(2));
  const symbol = CURRENCY_SYMBOLS[targetCurrency.toUpperCase()] || `${targetCurrency} `;
  
  // Reconstruct the price string with the new currency and values.
  // This approach is safer than string replacement and handles single values and ranges.
  // Note: This may lose prefixes like "Approx." but ensures conversion is correct.
  if (convertedNumbers.length > 1) {
    return `${symbol}${convertedNumbers[0]} - ${symbol}${convertedNumbers[1]}`;
  }
  return `${symbol}${convertedNumbers[0]}`;
};


// --- ICONS ---
const WeatherIcon: React.FC<{ icon: WeatherInfo['icon'] }> = ({ icon }) => {
    switch (icon) {
        case 'Sunny': return <SunIcon />;
        case 'PartlyCloudy': return <PartlyCloudyIcon />;
        case 'Cloudy': return <CloudIcon />;
        case 'Rainy': return <RainIcon />;
        case 'Thunderstorm': return <ThunderstormIcon />;
        default: return <CloudIcon />; // Default icon
    }
};

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.828 0l-4.243 -4.243a8 8 0 1 1 11.314 0z" />
    </svg>
);

const SwapIcon: React.FC<{isSwapping: boolean}> = ({isSwapping}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${isSwapping ? 'animate-spin' : ''}`} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
);


// --- PRINTABLE COMPONENT ---
const PrintableContent: React.FC<Pick<ItineraryDisplayProps, 'plan' | 'destination' | 'startDate'> & { getDayDate: (dayIndex: number) => string, convertPrice: (price: string | undefined) => string }> = ({ plan, destination, getDayDate, convertPrice }) => (
    <div className="p-8 bg-white text-gray-800">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4">
                {plan.countryCode && (
                    <img
                        src={`https://flagcdn.com/${plan.countryCode.toLowerCase()}.svg`}
                        alt={`${destination} flag`}
                        className="h-10 rounded shadow-md"
                        crossOrigin="anonymous" 
                    />
                )}
                <h1 className="text-4xl font-extrabold text-gray-900">Your Trip to {destination}</h1>
            </div>
            <p className="text-xl text-gray-600 mt-2">{plan.itinerary.length} Days of Adventure</p>
        </div>
        {/* Daily Itinerary */}
        <div className="mb-10" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">Daily Itinerary</h2>
            <div className="space-y-12">
                {plan.itinerary.map((day, index) => (
                    <div key={day.day} className="border-l-4 border-indigo-500 pl-6 relative">
                        <div className="absolute -left-3.5 top-0 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white"></div>
                        <h3 className="text-2xl font-bold text-gray-800">Day {day.day}: {day.title}</h3>
                        <p className="text-md text-gray-500 mb-6">{getDayDate(index)}</p>
                        <div className="space-y-8">
                            {day.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex gap-6 p-4 bg-gray-50 rounded-lg">
                                    {activity.imageUrl && (
                                        <img src={activity.imageUrl} alt={activity.description} className="w-1/3 h-48 object-cover rounded-md shadow-md" crossOrigin="anonymous" />
                                    )}
                                    <div className="w-2/3">
                                        <p className="font-semibold text-indigo-700">{activity.time}</p>
                                        <p className="text-lg font-bold text-gray-900 mt-1">{activity.description}</p>
                                        <div className="text-sm text-gray-600 mt-2 space-y-2">
                                            <p><span className="font-semibold">Transport:</span> {activity.transport}</p>
                                            <p><span className="font-semibold">Cost:</span> {convertPrice(activity.estimatedCost)}</p>
                                            <p><span className="font-semibold">Location:</span> {activity.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {/* Weather Forecast */}
        <div className="mb-10" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">Weather Forecast</h2>
            <div className="grid grid-cols-4 gap-4">
                {plan.weatherForecast.map((weather, index) => (
                    <div key={weather.day} className="bg-gray-50 p-4 rounded-lg text-center flex flex-col items-center">
                        <p className="font-bold text-sm text-gray-800">{getDayDate(index).split(',')[0]}</p>
                        <div className="my-2"><WeatherIcon icon={weather.icon} /></div>
                        <p className="font-semibold text-gray-900">{weather.tempHigh}° / {weather.tempLow}°C</p>
                        <p className="text-xs text-gray-600 mt-1">{weather.forecast}</p>
                    </div>
                ))}
            </div>
        </div>
        {/* Travel Info */}
        <div className="mb-10" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">Travel Info</h2>
        </div>
        {/* Hotel Suggestions */}
         {plan.hotelSuggestions && plan.hotelSuggestions.length > 0 && (
            <div className="mb-10" style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">Hotel Suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plan.hotelSuggestions.map((hotel) => (
                        <div key={`${hotel.day}-${hotel.name}`} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <p className="text-sm font-semibold text-indigo-600">Recommendation for Day {hotel.day}</p>
                            <h4 className="font-bold text-xl text-gray-900 mt-1">{hotel.name}</h4>
                            <p className="text-gray-700 mt-2">{convertPrice(hotel.priceRange)}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// --- MAIN DISPLAY COMPONENT ---
const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan, destination, startDate, onReset, onSwapActivity }) => {
    const [activeTab, setActiveTab] = useState('itinerary');
    const [isPrinting, setIsPrinting] = useState(false);
    const [swappingActivityId, setSwappingActivityId] = useState<string | null>(null);
    
    // State for currency conversion
    const baseCurrency = plan.localCurrencyCode.toUpperCase();
    const [targetCurrency, setTargetCurrency] = useState(baseCurrency);
    const [conversionRates, setConversionRates] = useState<Record<string, number> | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    // State for Share Modal
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        if (baseCurrency) {
            setIsConverting(true);
            fetchConversionRates(baseCurrency).then(rates => {
                setConversionRates(rates);
                setIsConverting(false);
            });
        }
    }, [baseCurrency]);

    const handleSwapClick = async (dayIndex: number, activityIndex: number, day: ItineraryDay, activity: Activity) => {
        const uniqueId = `${dayIndex}-${activityIndex}`;
        setSwappingActivityId(uniqueId);
        try {
            await onSwapActivity(dayIndex, activityIndex, day, activity);
        } catch (error) {
            console.error("Failed to swap activity:", error);
            alert("Sorry, we couldn't swap the activity. Please try again.");
        } finally {
            setSwappingActivityId(null);
        }
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetCurrency(e.target.value);
    };

    const convertPrice = (price: string | undefined) => {
        return convertAndFormatPrice(price, targetCurrency, baseCurrency, conversionRates);
    };

    const getDayDate = (dayIndex: number) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayIndex);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const handleDownloadPdf = () => {
        setIsPrinting(true);
        const { jsPDF } = window.jspdf;
        const input = document.getElementById('printable-content-wrapper');
        
        if (input && window.html2canvas) {
            window.html2canvas(input, { scale: 2, useCORS: true, windowWidth: input.scrollWidth, windowHeight: input.scrollHeight }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgHeight = canvas.height * pdfWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position -= pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }
                pdf.save(`itinerary-${destination.toLowerCase().replace(/\s/g, '-')}.pdf`);
                setIsPrinting(false);
            });
        } else {
            alert('Could not download PDF. PDF generation library might not be loaded.');
            setIsPrinting(false);
        }
    };
    
    const generateEmailBody = (): string => {
        let body = `Hello!\n\nHere is the travel itinerary for the trip to ${destination}.\n\n`;
        body += `----------------------------------------\n`;
        
        plan.itinerary.forEach((day, index) => {
            const date = getDayDate(index);
            body += `\nDay ${day.day}: ${day.title} (${date})\n`;
            body += `--------------------\n`;
            day.activities.forEach(activity => {
                body += `  • ${activity.time}: ${activity.description}\n`;
                body += `    Location: ${activity.location}\n`;
                body += `    Transport: ${activity.transport}\n`;
                body += `    Estimated Cost: ${convertPrice(activity.estimatedCost)}\n\n`;
            });
        });

        body += `\nPowered by Itera AI.`;
        return body;
    };

    const handleCopyToClipboard = () => {
        const emailBody = generateEmailBody();
        navigator.clipboard.writeText(emailBody).then(() => {
            setHasCopied(true);
            // Reset button text after 2 seconds
            setTimeout(() => {
                setHasCopied(false);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers or if permissions fail
            alert('Could not copy text automatically. Please select the text and copy it manually.');
        });
    };

    const renderContent = () => (
        <>
            {activeTab === 'itinerary' && (
                 <div className="space-y-12">
                    {plan.itinerary.map((day, dayIndex) => (
                        <div key={day.day} className="border-l-4 border-indigo-500 pl-6 relative">
                            <div className="absolute -left-3.5 top-0 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white"></div>
                            <h3 className="text-2xl font-bold text-gray-800">Day {day.day}: {day.title}</h3>
                            <p className="text-md text-gray-500 mb-6">{getDayDate(dayIndex)}</p>
                            <div className="space-y-8">
                                {day.activities.map((activity, actIndex) => {
                                    const isSwapping = swappingActivityId === `${dayIndex}-${actIndex}`;
                                    return (
                                        <div key={actIndex} className="flex flex-col md:flex-row gap-6 p-4 bg-gray-50 rounded-lg">
                                            {activity.imageUrl && (
                                                <img src={activity.imageUrl} alt={activity.description} className="w-full md:w-1/3 h-48 object-cover rounded-md shadow-md" crossOrigin="anonymous" />
                                            )}
                                            <div className="w-full md:w-2/3">
                                                <p className="font-semibold text-indigo-700">{activity.time}</p>
                                                <p className="text-lg font-bold text-gray-900 mt-1">{activity.description}</p>
                                                <div className="text-sm text-gray-600 mt-2 space-y-2">
                                                    <p><span className="font-semibold">Transport:</span> {activity.transport}</p>
                                                    <p><span className="font-semibold">Cost:</span> {isConverting ? '...' : convertPrice(activity.estimatedCost)}</p>
                                                </div>
                                                <div className="mt-4 flex items-center gap-4 flex-wrap">
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm shadow-sm"
                                                    >
                                                        <MapPinIcon />
                                                        {activity.location}
                                                    </a>
                                                     <button onClick={() => handleSwapClick(dayIndex, actIndex, day, activity)} disabled={isSwapping} className="inline-flex items-center bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-sm shadow-sm disabled:bg-gray-400 disabled:cursor-wait">
                                                        <SwapIcon isSwapping={isSwapping} />
                                                        {isSwapping ? 'Swapping...' : 'Swap Activity'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {activeTab === 'weather' && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Weather Forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                        {plan.weatherForecast.map((weather, index) => (
                            <div key={weather.day} className="bg-gray-50 p-4 rounded-lg text-center flex flex-col items-center">
                                <p className="font-bold text-sm text-gray-800">{getDayDate(index).split(',')[0]}</p>
                                <div className="my-2"><WeatherIcon icon={weather.icon} /></div>
                                <p className="font-semibold text-gray-900">{weather.tempHigh}° / {weather.tempLow}°C</p>
                                <p className="text-xs text-gray-600 mt-1">{weather.forecast}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'info' && (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Best Time to Visit</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{plan.bestTimeToVisit}</p>
                    </div>
                     {plan.upcomingEvents.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Upcoming Events</h3>
                            <div className="space-y-3">
                                {plan.upcomingEvents.map(event => (
                                    <div key={event.name} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-semibold text-gray-900">{event.name}</p>
                                        <p className="text-gray-700 text-sm">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Safety & Cultural Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-bold text-lg mb-2">Cultural Etiquette</h4><ul className="list-disc list-inside space-y-1 text-gray-700">{plan.safetyTips.culturalEtiquette.map((tip, i) => <li key={i}>{tip}</li>)}</ul></div>
                            <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-bold text-lg mb-2">Scams to Avoid</h4><ul className="list-disc list-inside space-y-1 text-gray-700">{plan.safetyTips.scamsToAvoid.map((tip, i) => <li key={i}>{tip}</li>)}</ul></div>
                            <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-bold text-lg mb-2">General Advice</h4><ul className="list-disc list-inside space-y-1 text-gray-700">{plan.safetyTips.generalAdvice.map((tip, i) => <li key={i}>{tip}</li>)}</ul></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Packing List</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{plan.packingList.map(item => (<div key={item.item} className="bg-gray-50 p-4 rounded-lg"><p className="font-semibold text-gray-900">{item.item}</p><p className="text-gray-700 text-sm mb-2">{item.description}</p><a href={item.googleSearchUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Find on Google &rarr;</a></div>))}</div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Get Inspired</h3>
                        <a href={plan.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-md">Watch Travel Vlogs on YouTube</a>
                    </div>
                </div>
            )}
            {activeTab === 'hotels' && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Hotel Suggestions</h3>
                    {plan.hotelSuggestions && plan.hotelSuggestions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plan.hotelSuggestions.map((hotel) => (
                                <div key={`${hotel.day}-${hotel.name}`} className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-indigo-600">Recommendation for Day {hotel.day}</p>
                                        <h4 className="font-bold text-xl text-gray-900 mt-1">{hotel.name}</h4>
                                        <p className="text-gray-700 mt-2">{isConverting ? '...' : convertPrice(hotel.priceRange)}</p>
                                    </div>
                                    <a href={hotel.googleSearchUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm">Find on Google</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">No hotel suggestions available for this trip.</p>
                    )}
                </div>
            )}
        </>
    );

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {isShareModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog" onClick={() => setIsShareModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Itinerary</h3>
                        <p className="text-gray-600 mb-6">Copy the trip details below and paste them into an email or messaging app.</p>
                        <textarea
                            readOnly
                            className="w-full h-64 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={generateEmailBody()}
                        />
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsShareModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={handleCopyToClipboard}
                                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md w-40"
                            >
                                {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div id="printable-content-wrapper" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1024px' }}>
                <PrintableContent plan={plan} destination={destination} startDate={startDate} getDayDate={getDayDate} convertPrice={convertPrice} />
            </div>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4">
                            {plan.countryCode && (
                                <img
                                    src={`https://flagcdn.com/${plan.countryCode.toLowerCase()}.svg`}
                                    alt={`${destination} flag`}
                                    className="h-8 rounded shadow"
                                />
                            )}
                            <h2 className="text-4xl font-extrabold text-gray-900">Your Trip to {destination}</h2>
                        </div>
                        <p className="text-lg text-gray-600 mt-1 pl-1">{plan.itinerary.length} Days of Adventure</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
                        <div className="flex items-center gap-2">
                             <label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency:</label>
                             <select id="currency" value={targetCurrency} onChange={handleCurrencyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2">
                               {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                               {!SUPPORTED_CURRENCIES.includes(baseCurrency) && <option key={baseCurrency} value={baseCurrency}>{baseCurrency}</option>}
                            </select>
                        </div>
                         <button onClick={() => setIsShareModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                            Share
                        </button>
                         <button onClick={handleDownloadPdf} disabled={isPrinting} className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-wait">
                            {isPrinting ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button onClick={onReset} className="bg-gray-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-800 transition-colors shadow-md">New Trip</button>
                    </div>
                </div>

                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('itinerary')} className={`${activeTab === 'itinerary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Itinerary</button>
                        <button onClick={() => setActiveTab('weather')} className={`${activeTab === 'weather' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Weather</button>
                        <button onClick={() => setActiveTab('info')} className={`${activeTab === 'info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Travel Info</button>
                        <button onClick={() => setActiveTab('hotels')} className={`${activeTab === 'hotels' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Hotels</button>
                    </nav>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default ItineraryDisplay;