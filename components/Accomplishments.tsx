import React from 'react';

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-1.5" />
        <path d="M19 9a3.5 3.5 0 0 0 -3.5 -3.5" />
        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h1.5" />
        <path d="M5 9a3.5 3.5 0 0 1 3.5 -3.5" />
        <path d="M12 3a3.5 3.5 0 0 1 3.5 3.5" />
        <path d="M12 3a3.5 3.5 0 0 0 -3.5 3.5" />
    </svg>
);

const InteractiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M12 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    </svg>
);

const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
        <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
        <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    </svg>
);

const SmartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 12l5 5l10 -10" />
    </svg>
);


const accomplishments = [
    {
        icon: <BrainIcon />,
        title: "End-to-End AI Generation",
        description: "We go beyond simple text. Using Gemini's advanced JSON mode, we generate a complete, structured travel plan—from daily activities and hotel suggestions to a personalized packing list—all from a single request.",
    },
    {
        icon: <InteractiveIcon />,
        title: "Dynamic & Interactive Plans",
        description: "Your itinerary isn't set in stone. Don't like an activity? Swap it! Our AI understands the context of your trip and suggests a relevant replacement on the fly. You can also download your plan as a PDF for offline use.",
    },
    {
        icon: <RocketIcon />,
        title: "Multi-Modal & Efficient",
        description: "To make your itinerary visually stunning, we use a multi-modal approach. After generating the text-based plan, we make parallel calls to an image generation model to create a unique photo for every single activity.",
    },
    {
        icon: <SmartIcon />,
        title: "Intelligent User Experience",
        description: "We use AI to enhance the entire process. As you type your destination, we validate it in real-time to catch typos. Plus, the app remembers your last trip, so you can pick up right where you left off.",
    },
];

const Accomplishments: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-base text-indigo-600 font-semibold tracking-wider uppercase">Features</h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    Accomplishments We're Proud Of
                </p>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Discover the smart technology that makes your travel planning effortless.
                </p>
            </div>

            <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {accomplishments.map((item) => (
                        <div key={item.title} className="p-8 bg-gray-50 rounded-2xl shadow-lg border border-gray-200">
                            <div className="flex-shrink-0">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                            <p className="mt-4 text-base text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Accomplishments;
