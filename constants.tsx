
import React from 'react';
// FIX: The types are now correctly imported from types.ts after breaking a circular dependency.
import { ActivityType, TravelCompanion, Budget, BudgetOption, TravelPace, PaceOption } from './types';

export const BeachIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.553 16.75a7.5 7.5 0 0 0 -10.106 0" /><path d="M18 3.804a7.5 7.5 0 0 0 -11.196 3.192" /><path d="M15.65 6a3 3 0 0 0 -3.65 -3a3 3 0 0 0 -3.65 3a3 3 0 0 0 3.65 3a3 3 0 0 0 3.65 -3" /><path d="M12 12c-2.485 .6 -4.5 2.8 -4.5 5.5c0 3.038 2.015 5.5 4.5 5.5s4.5 -2.462 4.5 -5.5c0 -2.7 -2.015 -4.9 -4.5 -5.5z" />
    </svg>
);

export const CityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21h18" /><path d="M5 21v-14l8 -4v18" /><path d="M19 21v-10l-6 -4" /><path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" />
    </svg>
);

export const OutdoorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17l6 -6l4 4l8 -8" /><path d="M14 7l7 0l0 7" />
    </svg>
);

export const FestivalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5h16" /><path d="M5 4v16" /><path d="M19 4v16" /><path d="M6.5 12h11" /><path d="M8 5v-1h8v1" /><path d="M14 12v-2a2 2 0 1 1 4 0v2" /><path d="M6 12v-2a2 2 0 1 0 -4 0v2" />
    </svg>
);

export const FoodIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 19h18" /><path d="M3 11h18a3.988 3.988 0 0 1 -2 3.8a3.988 3.988 0 0 1 -2 0a3.988 3.988 0 0 1 -2 -3.8a3.988 3.988 0 0 1 -2 0a3.988 3.988 0 0 1 -2 -3.8a3.988 3.988 0 0 1 -2 0a3.988 3.988 0 0 1 -2 -3.8a3.988 3.988 0 0 1 -2 0" /><path d="M11 11v8" /><path d="M7.5 11v8" /><path d="M4.5 11v8" /><path d="M13.5 11v8" /><path d="M16.5 11v8" /><path d="M19.5 11v8" />
    </svg>
);

export const NightlifeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4a1 1 0 0 1 .993 .883l.007 .117v1l-.004 .1a2 2 0 0 0 .127 .818a4 4 0 0 1 1.05 2.502a5 5 0 0 1 -4.175 4.93v2.05a1 1 0 0 1 -.883 .993l-.117 .007h-1a1 1 0 0 1 -.993 -.883l-.007 -.117v-2.05a5 5 0 0 1 -4.175 -4.93a4 4 0 0 1 1.05 -2.502a2 2 0 0 0 .127 -.818l-.004 -.1v-1a1 1 0 0 1 1 -1h3z" /><path d="M15 11l.117 .007a1 1 0 0 1 .876 .876l.007 .117v3.5a2.5 2.5 0 0 1 -2.336 2.493l-.164 .007a2.5 2.5 0 0 1 -2.5 -2.5v-3.5a1 1 0 0 1 1 -1h2z" /><path d="M18 10l.127 .007a1 1 0 0 1 .873 .993v2.5a2.5 2.5 0 0 1 -2.336 2.493l-.164 .007a2.5 2.5 0 0 1 -2.5 -2.5v-2.5a1 1 0 0 1 1 -1h2z" />
    </svg>
);

export const ShoppingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" /><path d="M9 11v-5a3 3 0 0 1 6 0v5" />
    </svg>
);

export const WellnessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 1 0 -18a9 9 0 0 1 0 18z" /><path d="M12 3a9 9 0 0 0 0 18" /><path d="M14 10a2 2 0 1 0 -4 0v4" />
    </svg>
);

export const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
    </svg>
);

export const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12" />
    </svg>
);

export const RainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7" /><path d="M11 19v1" /><path d="M15 19v1" /><path d="M7 19v1" />
    </svg>
);

export const ThunderstormIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.5 21.5l-3.5 -6.5l4 -4l-5.5 -4.5l3.5 6.5l-4 4l5.5 4.5" /><path d="M8 4.894c.12 .031 .243 .053 .369 .066c.636 .062 1.251 .123 1.831 .184m5.628 2.016c.23 .134 .456 .28 .672 .434a5 4.5 0 0 1 1.5 8.406h1a3.5 3.5 0 0 1 .84 6.862" /><path d="M7 18a4.6 4.4 0 0 1 -.096 -9.07" />
    </svg>
);

export const PartlyCloudyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.5 21.5l-3.5 -6.5l4 -4l-5.5 -4.5l3.5 6.5l-4 4l5.5 4.5" /><path d="M8 4.894c.12 .031 .243 .053 .369 .066c.636 .062 1.251 .123 1.831 .184m5.628 2.016c.23 .134 .456 .28 .672 .434a5 4.5 0 0 1 1.5 8.406h1a3.5 3.5 0 0 1 .84 6.862" /><path d="M7 18a4.6 4.4 0 0 1 -.096 -9.07" />
    </svg>
);

export const ACTIVITIES = [
    { type: ActivityType.BEACHES, icon: <BeachIcon /> },
    { type: ActivityType.CITY_SIGHTSEEING, icon: <CityIcon /> },
    { type: ActivityType.OUTDOOR_ADVENTURES, icon: <OutdoorIcon /> },
    { type: ActivityType.FESTIVALS_EVENTS, icon: <FestivalIcon /> },
    { type: ActivityType.FOOD_EXPLORATION, icon: <FoodIcon /> },
    { type: ActivityType.NIGHTLIFE, icon: <NightlifeIcon /> },
    { type: ActivityType.SHOPPING, icon: <ShoppingIcon /> },
    { type: ActivityType.WELLNESS, icon: <WellnessIcon /> },
];

export const COMPANIONS = Object.values(TravelCompanion);

export const BUDGETS: BudgetOption[] = [
    { key: Budget.BUDGET_FRIENDLY, label: 'Budget-Friendly', range: '< $100 / day' },
    { key: Budget.MID_RANGE, label: 'Mid-Range', range: '$100 - $250 / day' },
    { key: Budget.LUXURY, label: 'Luxury', range: '> $250 / day' },
];

export const TRAVEL_PACE_OPTIONS: PaceOption[] = [
    { key: TravelPace.RELAXED, label: 'Relaxed', description: 'Fewer, spaced-out activities' },
    { key: TravelPace.BALANCED, label: 'Balanced', description: 'A moderate amount of activities' },
    { key: TravelPace.ACTION_PACKED, label: 'Action-Packed', description: 'A full schedule of activities' },
];