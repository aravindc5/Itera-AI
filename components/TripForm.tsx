import React, { useState } from 'react';
import { TripPreferences, ActivityType, TravelCompanion, Budget, TravelPace } from '../types.ts';
import { ACTIVITIES, COMPANIONS, BUDGETS, TRAVEL_PACE_OPTIONS } from '../constants.tsx';

interface TripFormProps {
  preferences: TripPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<TripPreferences>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  destinationValidation: {
    status: 'idle' | 'loading' | 'valid' | 'invalid';
    message: string;
  };
}

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const TripForm: React.FC<TripFormProps> = ({ preferences, setPreferences, onSubmit, isLoading, destinationValidation }) => {
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleActivityToggle = (activity: ActivityType) => {
    setPreferences((prev) => {
      const activities = prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity];
      return { ...prev, activities };
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value > 30) {
        setDurationError("Planning for more than 30 days is coming soon in our premium version!");
    } else {
        setDurationError(null);
    }
    setPreferences({ ...preferences, duration: value });
  };

  const isFormValid =
    preferences.destination.trim() !== '' &&
    destinationValidation.status !== 'invalid' &&
    preferences.startDate !== '' &&
    preferences.duration > 0 &&
    preferences.duration <= 30 &&
    preferences.activities.length > 0;

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
      
      {/* Step 1: Destination & Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="destination" className="block text-lg font-medium text-gray-700 mb-2">1. Destination</label>
            <div className="relative">
                <input
                    id="destination"
                    type="text"
                    value={preferences.destination}
                    onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
                    placeholder="e.g., Tokyo, Japan"
                    className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition pr-10"
                    required
                    aria-describedby="destination-validation-message"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {destinationValidation.status === 'loading' && <SpinnerIcon />}
                    {destinationValidation.status === 'valid' && <CheckCircleIcon />}
                    {destinationValidation.status === 'invalid' && <ExclamationCircleIcon />}
                </div>
            </div>
            {destinationValidation.status === 'invalid' && destinationValidation.message && (
                <p id="destination-validation-message" className="text-red-600 text-sm mt-1">{destinationValidation.message}</p>
            )}
        </div>
        <div>
           <label htmlFor="duration" className="block text-lg font-medium text-gray-700 mb-2">3. Duration (days)</label>
          <input
            id="duration"
            type="number"
            min="1"
            value={preferences.duration || ''}
            onChange={handleDurationChange}
            placeholder="e.g., 7"
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            required
            aria-describedby="duration-info-message"
          />
          {durationError && (
            <p id="duration-info-message" className="text-indigo-600 text-sm mt-1">{durationError}</p>
          )}
        </div>
         <div className="md:col-span-1">
          <label htmlFor="startDate" className="block text-lg font-medium text-gray-700 mb-2">2. Start Date</label>
          <input
            id="startDate"
            type="date"
            value={preferences.startDate}
            onChange={(e) => setPreferences({ ...preferences, startDate: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            required
          />
        </div>
      </div>

      {/* Step 4: Companions */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">4. Who are you traveling with?</label>
        <div className="flex flex-wrap gap-4">
          {COMPANIONS.map((companion) => (
            <button
              key={companion}
              type="button"
              onClick={() => setPreferences({ ...preferences, companion })}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out ${
                preferences.companion === companion
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {companion}
            </button>
          ))}
        </div>
      </div>

      {/* Step 5: Budget */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">5. What's your budget?</label>
        <div className="flex flex-wrap gap-4">
          {BUDGETS.map((budget) => (
            <button
              key={budget.key}
              type="button"
              onClick={() => setPreferences({ ...preferences, budget: budget.key })}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out text-left ${
                preferences.budget === budget.key
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="block font-bold">{budget.label}</span>
              <span className="block text-xs">{budget.range}</span>
            </button>
          ))}
        </div>
      </div>

       {/* Step 6: Travel Pace */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">6. What's your travel pace?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRAVEL_PACE_OPTIONS.map((pace) => (
            <button
              key={pace.key}
              type="button"
              onClick={() => setPreferences({ ...preferences, pace: pace.key })}
              className={`p-4 rounded-lg text-left transition-all duration-300 ease-in-out ${
                preferences.pace === pace.key
                  ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="block font-bold">{pace.label}</span>
              <span className="block text-xs mt-1">{pace.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 7: Activities */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">7. What activities interest you?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ACTIVITIES.map(({ type, icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleActivityToggle(type)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ease-in-out cursor-pointer ${
                preferences.activities.includes(type)
                  ? 'bg-indigo-600 border-indigo-500 text-white scale-105'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              {icon}
              <span className="mt-2 text-center text-xs font-semibold">{type}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? 'Generating...' : 'Create My Itinerary'}
      </button>
    </form>
  );
};

export default TripForm;