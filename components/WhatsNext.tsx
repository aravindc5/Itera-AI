import React from 'react';

const CollaborationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 17c1.884 .04 3.602 -.84 4.5 -2" />
        <path d="M15 17c-1.884 .04 -3.602 -.84 -4.5 -2" />
        <path d="M12 13.5v-1.5" />
        <path d="M10.5 10.5c.667 -1 1.333 -1.5 2.5 -1.5s2.5 .5 2.5 2" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
);

const BookingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M15 5l0 2" />
        <path d="M15 11l0 2" />
        <path d="M15 17l0 2" />
        <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
        <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
    </svg>
);

const BudgetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
        <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
    </svg>
);

const futureFeatures = [
    {
        icon: <CollaborationIcon />,
        title: "Real-Time Collaboration",
        description: "Plan trips together with friends and family. Share your itinerary via a link and edit the plan in real-time, see changes as they happen, and leave comments on activities.",
    },
    {
        icon: <BookingIcon />,
        title: "Live Flight & Hotel Booking",
        description: "Go from planning to booked in minutes. We're working on integrating with booking platforms to help you find the best deals and book flights and hotels directly from your itinerary.",
    },
    {
        icon: <ChatIcon />,
        title: "AI-Powered Travel Agent Chat",
        description: "Have a question or need to make a change? Chat with our AI assistant. Simply ask 'Can you find a vegan restaurant near the museum?' or 'What's the weather like tomorrow?' for instant help.",
    },
    {
        icon: <BudgetIcon />,
        title: "Budget Tracking & Expense Management",
        description: "Stay on budget effortlessly. We plan to add tools to help you track your spending during your trip, splitting costs with friends and comparing your actual expenses against the AI-generated estimate.",
    },
];

const WhatsNext: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-base text-indigo-600 font-semibold tracking-wider uppercase">The Road Ahead</h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    What's Next for Itera AI
                </p>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Our journey is just beginning. Here are some of the exciting features we're dreaming up.
                </p>
            </div>

            <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {futureFeatures.map((item) => (
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

export default WhatsNext;
