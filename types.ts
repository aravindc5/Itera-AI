// FIX: Defined and exported enums here to resolve circular dependency with constants.ts.
export enum TravelCompanion {
  SOLO = 'Solo',
  COUPLE = 'Couple',
  FAMILY = 'Family',
  FRIENDS = 'Friends',
}

export enum ActivityType {
  BEACHES = 'Beaches & Sun',
  CITY_SIGHTSEEING = 'City Sightseeing',
  OUTDOOR_ADVENTURES = 'Outdoor Adventures',
  FESTIVALS_EVENTS = 'Festivals & Events',
  FOOD_EXPLORATION = 'Food Exploration',
  NIGHTLIFE = 'Nightlife',
  SHOPPING = 'Shopping',
  WELLNESS = 'Wellness & Spa',
}

export enum Budget {
  BUDGET_FRIENDLY = 'Budget-Friendly',
  MID_RANGE = 'Mid-Range',
  LUXURY = 'Luxury',
}

export enum TravelPace {
    RELAXED = 'Relaxed',
    BALANCED = 'Balanced',
    ACTION_PACKED = 'Action-Packed',
}

export interface BudgetOption {
  key: Budget;
  label: string;
  range: string;
}

export interface PaceOption {
    key: TravelPace;
    label: string;
    description: string;
}

export interface TripPreferences {
  destination: string;
  startDate: string;
  duration: number;
  companion: TravelCompanion;
  activities: ActivityType[];
  budget: Budget;
  pace: TravelPace;
}

export interface Activity {
  time: string;
  description: string;
  transport: string;
  location: string;
  estimatedCost?: string;
  imageUrl?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface WeatherInfo {
    day: number;
    forecast: string;
    icon: 'Sunny' | 'PartlyCloudy' | 'Cloudy' | 'Rainy' | 'Thunderstorm';
    tempHigh: number;
    tempLow: number;
}

export interface EventInfo {
    name: string;
    description: string;
}

export interface SafetyInfo {
    culturalEtiquette: string[];
    scamsToAvoid: string[];
    generalAdvice: string[];
}

export interface PackingItem {
    item: string;
    description: string;
    googleSearchUrl: string;
}

export interface HotelSuggestion {
    day: number;
    name: string;
    priceRange: string;
    googleSearchUrl: string;
}

export interface ItineraryPlan {
  itinerary: ItineraryDay[];
  weatherForecast: WeatherInfo[];
  bestTimeToVisit: string;
  upcomingEvents: EventInfo[];
  youtubeSearchUrl: string;
  safetyTips: SafetyInfo;
  packingList: PackingItem[];
  hotelSuggestions: HotelSuggestion[];
  localCurrencyCode: string; // e.g., 'EUR', 'JPY'
  countryCode: string; // e.g., 'FR', 'JP'
}

// Declarations for CDN libraries
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}
