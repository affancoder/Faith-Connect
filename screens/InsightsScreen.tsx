import React, { useState } from 'react';

// Mock Data
const overviewData = {
    accountsReached: { value: '18.3K', change: '+12.5%' },
    accountsEngaged: { value: '1.2K', change: '+8.2%' },
    totalFollowers: { value: '15.3K', change: '+212' },
};

const topPosts = [
    { id: 'p1', imageUrl: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=100&h=100&auto=format&fit=crop', reach: '5.2K' },
    { id: 'p2', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop', reach: '4.8K' },
    { id: 'p3', imageUrl: 'https://images.unsplash.com/photo-1580129958613-a327d7918128?q=80&w=100&h=100&auto=format&fit=crop', reach: '3.1K' },
];

const topStories = [
    { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1534008757038-2cb3b27b93e2?q=80&w=100&h=100&auto=format&fit=crop', reach: '2.5K' },
    { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1604145706342-8d1a1b399a2a?q=80&w=100&h=100&auto=format&fit=crop', reach: '1.9K' },
];

const followerDemographics = {
    topLocations: ['New York', 'Los Angeles', 'London', 'Sydney', 'Nairobi'],
    ageRange: {
        '18-24': 35, '25-34': 40, '35-44': 15, '45+': 10
    },
    gender: {
        'Women': 62, 'Men': 38
    }
};

interface InsightsScreenProps {
    onClose: () => void;
}

const InsightsScreen: React.FC<InsightsScreenProps> = ({ onClose }) => {
    const [timeRange, setTimeRange] = useState('Last 30 Days');

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-black z-50 flex flex-col animate-slide-in-up">
            {/* Header */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Insights</h1>
                    <button onClick={onClose} className="p-2 -mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow overflow-y-auto p-4 scrollbar-hide space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Insights Overview</h2>
                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-slate-100 dark:bg-slate-800 border-none rounded-md text-sm font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-blue">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                    </select>
                </div>

                {/* Overview Cards */}
                <section>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Accounts Reached */}
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Accounts Reached</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{overviewData.accountsReached.value}</p>
                            <p className="text-xs font-semibold text-green-500">{overviewData.accountsReached.change}</p>
                        </div>
                        {/* Accounts Engaged */}
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Accounts Engaged</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{overviewData.accountsEngaged.value}</p>
                            <p className="text-xs font-semibold text-green-500">{overviewData.accountsEngaged.change}</p>
                        </div>
                        {/* Total Followers */}
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Followers</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{overviewData.totalFollowers.value}</p>
                            <p className="text-xs font-semibold text-green-500">{overviewData.totalFollowers.change}</p>
                        </div>
                    </div>
                </section>

                {/* Content You Shared */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Content You Shared</h3>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        {/* Top Posts */}
                        <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Top Posts</p>
                        <div className="space-y-2">
                            {topPosts.map(post => (
                                <div key={post.id} className="flex items-center space-x-3 text-sm">
                                    <img src={post.imageUrl} alt="post" className="w-10 h-10 object-cover rounded" />
                                    <p className="flex-grow font-medium text-slate-600 dark:text-slate-400">Post from [Date]</p>
                                    <p><span className="font-bold text-slate-800 dark:text-slate-200">{post.reach}</span> <span className="text-slate-500 dark:text-slate-400">reached</span></p>
                                </div>
                            ))}
                        </div>
                        <hr className="my-3 border-slate-200 dark:border-slate-700" />
                        {/* Top Stories */}
                        <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Top Stories</p>
                        <div className="space-y-2">
                             {topStories.map(story => (
                                <div key={story.id} className="flex items-center space-x-3 text-sm">
                                    <img src={story.imageUrl} alt="story" className="w-10 h-10 object-cover rounded" />
                                    <p className="flex-grow font-medium text-slate-600 dark:text-slate-400">Story from [Date]</p>
                                    <p><span className="font-bold text-slate-800 dark:text-slate-200">{story.reach}</span> <span className="text-slate-500 dark:text-slate-400">reached</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Audience */}
                 <section>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Your Audience</h3>
                     <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                             <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Top Locations</p>
                             <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                {followerDemographics.topLocations.map(loc => <li key={loc}>{loc}</li>)}
                             </ul>
                        </div>
                        <div>
                             <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Gender</p>
                             <div className="flex space-x-4">
                                {Object.entries(followerDemographics.gender).map(([gender, pct]) => (
                                    <div key={gender}><span className="font-bold text-slate-800 dark:text-slate-200">{pct}%</span> <span className="text-slate-500 dark:text-slate-400 text-sm">{gender}</span></div>
                                ))}
                             </div>
                        </div>
                     </div>
                </section>
            </main>
        </div>
    );
};
export default InsightsScreen;