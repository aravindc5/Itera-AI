
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import TripForm from './components/TripForm.tsx';
import ItineraryDisplay from './components/ItineraryDisplay.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import Accomplishments from './components/Accomplishments.tsx';
import WhatsNext from './components/WhatsNext.tsx';
import { TripPreferences, ItineraryPlan, TravelCompanion, ActivityType, Budget, TravelPace, ItineraryDay, Activity } from './types.ts';
import { generateItinerary, validateDestination, swapActivity } from './services/geminiService.ts';

/**
 * Creates a "light" version of an itinerary plan by removing the large `imageUrl`
 * fields from all activities. This is used to prevent exceeding localStorage quotas.
 * @param plan The full ItineraryPlan object.
 * @returns A new ItineraryPlan object without image URLs.
 */
const stripImagesFromPlan = (plan: ItineraryPlan): ItineraryPlan => {
    return {
        ...plan,
        itinerary: plan.itinerary.map(day => ({
            ...day,
            activities: day.activities.map(({ imageUrl, ...activity }) => activity)
        }))
    };
};

export const App: React.FC = () => {
  const initialPreferences: TripPreferences = {
    destination: '',
    startDate: new Date().toISOString().split("T")[0],
    duration: 7,
    companion: TravelCompanion.SOLO,
    activities: [],
    budget: Budget.MID_RANGE,
    pace: TravelPace.BALANCED,
  };

  const [preferences, setPreferences] = useState<TripPreferences>(initialPreferences);
  const [itinerary, setItinerary] = useState<ItineraryPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [savedData, setSavedData] = useState<{ plan: ItineraryPlan; preferences: TripPreferences } | null>(null);
  const [showLoadPrompt, setShowLoadPrompt] = useState<boolean>(false);
  
  const [destinationValidation, setDestinationValidation] = useState<{
    status: 'idle' | 'loading' | 'valid' | 'invalid';
    message: string;
  }>({ status: 'idle', message: '' });

  useEffect(() => {
    try {
      const savedItineraryJson = localStorage.getItem('savedItinerary');
      if (savedItineraryJson) {
        const parsedData = JSON.parse(savedItineraryJson);
        setSavedData(parsedData);
        setShowLoadPrompt(true);
      }
    } catch (e) {
      console.error("Failed to load saved itinerary from localStorage", e);
      localStorage.removeItem('savedItinerary');
    }
  }, []);
  
  // Debounced destination validation
  useEffect(() => {
    // Trim and check length. Don't validate if too short.
    const destination = preferences.destination.trim();
    if (destination.length < 3) {
      setDestinationValidation({ status: 'idle', message: '' });
      return;
    }
    
    // Set status to loading immediately
    setDestinationValidation({ status: 'loading', message: '' });

    const handler = setTimeout(async () => {
      try {
        const validation = await validateDestination(destination);
        if (validation.isValid) {
          setDestinationValidation({ status: 'valid', message: '' });
          // Auto-correct the destination name if it's different and not currently being edited
          if (validation.correctedName && validation.correctedName.toLowerCase() !== destination.toLowerCase()) {
              setPreferences(p => ({ ...p, destination: validation.correctedName }));
          }
        } else {
          setDestinationValidation({ status: 'invalid', message: 'Invalid destination' });
        }
      } catch (error) {
        // In case of API error during validation, gracefully default to allowing submission
        console.error("Destination validation failed:", error);
        setDestinationValidation({ status: 'valid', message: '' }); // Default to valid to not block user
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [preferences.destination]);


  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setItinerary(null);
    setIsLoading(true);

    try {
      // Final validation check before submitting
      const validation = await validateDestination(preferences.destination);
      if (!validation.isValid) {
        throw new Error("Please enter a valid travel destination. The location you entered could not be found.");
      }
      
      const correctedPreferences = { ...preferences, destination: validation.correctedName };
      setPreferences(correctedPreferences);

      const result = await generateItinerary(correctedPreferences);
      
      setItinerary(result);

      // Automatically save the new itinerary (without images)
      try {
        const planForStorage = stripImagesFromPlan(result);
        const dataToSave = { plan: planForStorage, preferences: correctedPreferences };
        localStorage.setItem('savedItinerary', JSON.stringify(dataToSave));
        setSavedData(dataToSave); // Update saved data state
      } catch (saveError) {
        console.error("Failed to auto-save itinerary to localStorage", saveError);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivitySwapRequest = async (dayIndex: number, activityIndex: number, day: ItineraryDay, activityToSwap: Activity) => {
    if (!itinerary) return;

    const newActivity = await swapActivity(preferences, day, activityToSwap);

    const newItinerary = { ...itinerary };
    const newDays = [...newItinerary.itinerary];
    const newDay = { ...newDays[dayIndex] };
    const newActivities = [...newDay.activities];
    
    newActivities[activityIndex] = newActivity;
    newDay.activities = newActivities;
    newDays[dayIndex] = newDay;
    newItinerary.itinerary = newDays;

    setItinerary(newItinerary);

    // Automatically re-save the updated itinerary (without images)
    try {
        const planForStorage = stripImagesFromPlan(newItinerary);
        const dataToSave = { plan: planForStorage, preferences };
        localStorage.setItem('savedItinerary', JSON.stringify(dataToSave));
        setSavedData(dataToSave);
    } catch (saveError) {
        console.error("Failed to re-save itinerary after swap", saveError);
    }
  };

  const handleLoadSavedItinerary = () => {
    if (savedData) {
      setItinerary(savedData.plan);
      setPreferences(savedData.preferences);
      setShowLoadPrompt(false);
    }
  };

  const handleDismissSavedItinerary = () => {
    localStorage.removeItem('savedItinerary');
    setShowLoadPrompt(false);
    setSavedData(null);
  };

  const handleReset = () => {
    setPreferences(initialPreferences);
    setItinerary(null);
    setError(null);
    localStorage.removeItem('savedItinerary');
    setSavedData(null);
    setShowLoadPrompt(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto text-center" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {showLoadPrompt && savedData && !itinerary && (
            <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 rounded-lg mb-6 max-w-4xl mx-auto shadow-lg" role="alert">
              <p className="font-bold">Welcome back!</p>
              <p>We found your saved trip to {savedData.preferences.destination}. Would you like to load it?</p>
              <div className="mt-4">
                <button onClick={handleLoadSavedItinerary} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors mr-2">
                  Load Trip
                </button>
                <button onClick={handleDismissSavedItinerary} className="bg-transparent text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition-colors">
                  Start New
                </button>
              </div>
            </div>
          )}
          
          {!itinerary && !isLoading && (
            <>
              <TripForm 
                preferences={preferences}
                setPreferences={setPreferences}
                onSubmit={handleGenerateItinerary}
                isLoading={isLoading}
                destinationValidation={destinationValidation}
              />
              <Accomplishments />
              <WhatsNext />
            </>
          )}

          {isLoading && <LoadingSpinner />}
          
          {itinerary && !isLoading && (
            <ItineraryDisplay 
              plan={itinerary} 
              destination={preferences.destination}
              startDate={preferences.startDate}
              onReset={handleReset} 
              onSwapActivity={handleActivitySwapRequest}
            />
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};