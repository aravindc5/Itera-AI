import { GoogleGenAI, Modality, Type } from "@google/genai";
import { TripPreferences, ItineraryPlan, ItineraryDay, Activity } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const validateDestination = async (destination: string): Promise<{ isValid: boolean; correctedName: string }> => {
  const validationSchema = {
    type: Type.OBJECT,
    properties: {
      isValid: {
        type: Type.BOOLEAN,
        description: 'True if the destination is a valid, real place for travel (e.g., city, country, famous landmark/region), false otherwise.',
      },
      correctedName: {
          type: Type.STRING,
          description: 'If valid, the corrected or standardized name of the destination (e.g., "Pari" -> "Paris"). If invalid, return an empty string.'
      }
    },
    required: ['isValid', 'correctedName'],
  };

  const prompt = `
    Please validate if the following is a real and valid travel destination.
    Destination: "${destination}"
    Consider common typos or variations. If it's a fictional place or doesn't exist, it's invalid.
    Respond ONLY with the JSON object based on the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
      },
    });

    const text = response.text.trim();
    const parsedJson = JSON.parse(text);

    if (typeof parsedJson.isValid !== 'boolean' || typeof parsedJson.correctedName !== 'string') {
        console.error('Invalid validation response structure:', parsedJson);
        return { isValid: true, correctedName: destination };
    }

    return parsedJson;

  } catch (error) {
    console.error(`Error validating destination "${destination}":`, error);
    return { isValid: true, correctedName: destination };
  }
};

const activitySchema = {
    type: Type.OBJECT,
    properties: {
        time: {
            type: Type.STRING,
            description: "Suggested time for the activity, e.g., 'Morning (9:00 AM - 1:00 PM)', 'Afternoon', 'Evening'.",
        },
        description: {
            type: Type.STRING,
            description: 'A detailed description of the activity.',
        },
        transport: {
            type: Type.STRING,
            description: 'Suggested mode of transport to this activity from the previous one. The first activity of the day can have transport from accommodation.',
        },
        location: {
            type: Type.STRING,
            description: "A precise, searchable location name for the activity (e.g., 'Eiffel Tower, Paris, France').",
        },
        estimatedCost: {
            type: Type.STRING,
            description: "An approximate cost range for this activity in the LOCAL CURRENCY of the destination (e.g., '€20 - €30', 'Approx. ¥5000', 'Free'). This estimate must be tailored to the user's selected budget."
        }
    },
    required: ["time", "description", "transport", "location", "estimatedCost"],
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        itinerary: {
            type: Type.ARRAY,
            description: 'Array of daily itinerary plans.',
            items: {
                type: Type.OBJECT,
                properties: {
                    day: {
                        type: Type.INTEGER,
                        description: 'The day number, starting from 1.',
                    },
                    title: {
                        type: Type.STRING,
                        description: 'A catchy title for the day\'s theme or main event.',
                    },
                    activities: {
                        type: Type.ARRAY,
                        description: 'A list of activities for the day.',
                        items: activitySchema
                    },
                },
                 required: ["day", "title", "activities"],
            },
        },
        weatherForecast: {
            type: Type.ARRAY,
            description: 'A daily weather forecast for the duration of the trip.',
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: 'The day number of the trip.' },
                    forecast: { type: Type.STRING, description: 'A brief description of the expected weather.' },
                    icon: { type: Type.STRING, description: 'An icon keyword. Must be one of: Sunny, PartlyCloudy, Cloudy, Rainy, Thunderstorm.' },
                    tempHigh: { type: Type.INTEGER, description: 'The expected high temperature in Celsius.' },
                    tempLow: { type: Type.INTEGER, description: 'The expected low temperature in Celsius.' },
                },
                required: ["day", "forecast", "icon", "tempHigh", "tempLow"],
            },
        },
        bestTimeToVisit: {
            type: Type.STRING,
            description: 'A summary of the best months to visit the destination, considering weather and tourist seasons.',
        },
        upcomingEvents: {
            type: Type.ARRAY,
            description: 'A list of notable upcoming events or festivals in the destination.',
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'The name of the event.' },
                    description: { type: Type.STRING, description: 'A brief description of the event.' },
                },
                required: ["name", "description"],
            },
        },
        youtubeSearchUrl: {
            type: Type.STRING,
            description: 'A valid YouTube search URL for the destination. The search query should be for travel guides or vlogs, e.g., https://www.youtube.com/results?search_query=travel+guide+tokyo',
        },
        safetyTips: {
            type: Type.OBJECT,
            description: 'A collection of safety and cultural tips for the destination.',
            properties: {
                culturalEtiquette: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key cultural do\'s and don\'ts.' },
                scamsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Common scams to be aware of.' },
                generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'General safety advice.' },
            },
            required: ["culturalEtiquette", "scamsToAvoid", "generalAdvice"],
        },
        packingList: {
            type: Type.ARRAY,
            description: 'A personalized packing list with Google search links for items.',
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING, description: 'The name of the packing item.' },
                    description: { type: Type.STRING, description: 'A brief reason why this item is recommended.' },
                    googleSearchUrl: { type: Type.STRING, description: 'A valid Google search URL for the item.' },
                },
                required: ["item", "description", "googleSearchUrl"],
            },
        },
        hotelSuggestions: {
            type: Type.ARRAY,
            description: 'A list of hotel suggestions, one for each day of the itinerary. Hotels should be located near the day\'s main activities and align with the user\'s specified budget.',
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: 'The day number this hotel suggestion corresponds to.' },
                    name: { type: Type.STRING, description: 'The name of the recommended hotel.' },
                    priceRange: { type: Type.STRING, description: 'The approximate price range per night in the local currency, reflecting the user\'s budget.' },
                    googleSearchUrl: { type: Type.STRING, description: 'A valid Google search URL for the hotel.' },
                },
                required: ["day", "name", "priceRange", "googleSearchUrl"],
            },
        },
        localCurrencyCode: {
            type: Type.STRING,
            description: 'The three-letter ISO 4217 currency code for the destination (e.g., "EUR" for Paris, "JPY" for Tokyo, "USD" for New York City).',
        },
        countryCode: {
            type: Type.STRING,
            description: 'The two-letter ISO 3166-1 alpha-2 country code for the destination (e.g., "FR" for Paris, "JP" for Tokyo, "US" for California).',
        },
    },
    required: ["itinerary", "weatherForecast", "bestTimeToVisit", "upcomingEvents", "youtubeSearchUrl", "safetyTips", "packingList", "hotelSuggestions", "localCurrencyCode", "countryCode"],
};

const generateImageForActivity = async (activityDescription: string, destination: string): Promise<string> => {
    try {
        const prompt = `A vibrant, photorealistic image representing the following travel activity: "${activityDescription}" in ${destination}. Focus on the atmosphere and key elements of the activity.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            const base64ImageBytes: string = firstPart.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            return imageUrl;
        }
        throw new Error('No image data returned from API.');
    } catch (error: any) {
        console.error(`Error generating image for "${activityDescription}":`, error);
        let message = `Image generation failed for "${activityDescription}".`;
        if (error.message?.includes('quota')) {
            message += ' Quota may be exceeded.';
        }
        throw new Error(message);
    }
};

export const swapActivity = async (preferences: TripPreferences, day: ItineraryDay, activityToSwap: Activity): Promise<Activity> => {
    const existingActivities = day.activities.map(a => a.description).join(', ');
    
    const prompt = `
        Based on the following travel preferences, suggest a *new and different* activity to replace an existing one.

        **User Preferences:**
        - Destination: ${preferences.destination}
        - Interests: ${preferences.activities.join(', ')}
        - Budget: ${preferences.budget}
        - Companion(s): ${preferences.companion}

        **Day's Context:**
        - Day Theme: ${day.title}
        - Existing Activities for the day: ${existingActivities}
        - Activity to Replace: "${activityToSwap.description}" at ${activityToSwap.time}

        **Task:**
        Generate ONE new activity that fits the user's interests and the day's theme. It must be different from all other activities listed for the day. The new activity's time should be similar to the one it's replacing.
        
        Respond ONLY with a single JSON object for the new activity based on the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: activitySchema,
            },
        });
        const text = response.text.trim();
        
        let newActivity: Activity;
        try {
            newActivity = JSON.parse(text);
        } catch(parseError) {
             console.error("Failed to parse JSON from swap activity response:", text, parseError);
            throw new Error("The AI returned an invalid format. Please try again.");
        }

        let imageUrl = '';
        try {
             imageUrl = await generateImageForActivity(newActivity.description, preferences.destination);
        } catch (imageError) {
            console.warn(`Image generation failed for swapped activity "${newActivity.description}", continuing without image.`, imageError);
        }
        
        return { ...newActivity, imageUrl };

    } catch (error: any) {
        console.error("Error swapping activity:", error);
        if (error.message.includes("invalid format")) {
            throw error;
        }
        throw new Error("Failed to get a new activity from the AI. It might be busy. Please try again.");
    }
};

export const generateItinerary = async (preferences: TripPreferences): Promise<ItineraryPlan> => {
  const prompt = `
    Create a comprehensive travel plan based on the following preferences. You must provide all requested sections.

    **User Preferences:**
    - Destination: ${preferences.destination}
    - Travel Date: Starting ${preferences.startDate}
    - Duration: ${preferences.duration} days
    - Companion(s): ${preferences.companion}
    - Interests: ${preferences.activities.join(', ')}
    - Budget: ${preferences.budget}
    - Travel Pace: ${preferences.pace}. This means:
        - 'Relaxed': Fewer (2-3) well-spaced activities per day.
        - 'Balanced': A moderate amount (3-5) of activities per day.
        - 'Action-Packed': A full day with many (5+) activities.

    **Required Output Sections (Respond ONLY with the JSON object based on the schema):**

    1.  **Itinerary:** A detailed, day-by-day plan reflecting the user's chosen travel pace. For each activity, include a time, a description, suggested transportation, a *specific, searchable location name*, and an **estimated cost**. The cost MUST be an approximate range in the **local currency** of the destination (e.g., '€20 - €30', 'Approx. ¥5000', or 'Free') and should be tailored to the user's selected budget.
    2.  **Weather Forecast:** A daily forecast for the trip duration (${preferences.duration} days) with description, icon keyword (Sunny, PartlyCloudy, Cloudy, Rainy, Thunderstorm), and high/low temps in Celsius.
    3.  **Best Time to Visit:** A short paragraph about the best time to visit ${preferences.destination}.
    4.  **Upcoming Events:** List significant events in ${preferences.destination} around the travel dates. If there are none, state that clearly.
    5.  **YouTube Search Link:** A single, valid YouTube search URL for travel vlogs/guides for ${preferences.destination}.
    6.  **Safety Tips:** Provide essential safety and cultural advice for a traveler in ${preferences.destination}. This must include:
        - A list of cultural etiquette points (do's and don'ts).
        - A list of common scams to be aware of.
        - A list of general safety advice.
    7.  **Personalized Packing List:** Generate a packing list based on weather, activities, and trip duration. For each item, provide its name, a brief description of why it's needed, and a valid Google search URL to find the product.
    8.  **Hotel Suggestions:** Provide one hotel suggestion for each day of the trip. The hotel should be conveniently located for that day's activities and align with the user's budget (${preferences.budget}). For each hotel, include the day number it corresponds to, its name, an approximate price range per night in the local currency, and a valid Google search URL for it.
    9.  **Local Currency Code:** Provide the three-letter ISO 4217 currency code for the destination (e.g., "EUR" for Paris, "JPY" for Tokyo).
    10. **Country Code:** Provide the two-letter ISO 3166-1 alpha-2 country code for the destination (e.g., "FR" for France, "JP" for Japan, "US" for California).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text.trim();
    const parsedJson: ItineraryPlan = JSON.parse(text);
    
    if (!parsedJson || !Array.isArray(parsedJson.itinerary)) {
      throw new Error("Invalid itinerary structure received from API.");
    }

    const allActivities = parsedJson.itinerary.flatMap(day => day.activities);

    const imagePromises = allActivities.map(activity => 
        generateImageForActivity(activity.description, preferences.destination)
    );

    const imageResults = await Promise.allSettled(imagePromises);

    let activityIndex = 0;
    const itineraryWithImages = parsedJson.itinerary.map(day => {
        const activitiesWithImages = day.activities.map(activity => {
            const result = imageResults[activityIndex++];
            const imageUrl = result.status === 'fulfilled' ? result.value : '';
            if (result.status === 'rejected') {
                console.warn(result.reason);
            }
            return { ...activity, imageUrl };
        });
        return { ...day, activities: activitiesWithImages };
    });
    
    return { ...parsedJson, itinerary: itineraryWithImages };

  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    if (error.message?.includes('API key')) {
        throw new Error('The API Key is invalid or missing. Please ensure it is configured correctly.');
    }
    if (error.message?.toLowerCase().includes('quota') || error.message?.includes('429')) {
        throw new Error('API quota exceeded. Please check your usage limits and billing, then try again later.');
    }
    if (error.message?.includes('Invalid itinerary structure')) {
        throw new Error('The AI returned an invalid response. Please try generating the itinerary again.');
    }
    throw new Error("Failed to generate itinerary. The AI may be busy or the request was invalid. Please try again.");
  }
};