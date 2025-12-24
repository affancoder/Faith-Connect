import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PullToRefresh from '../components/PullToRefresh';
import CreateEventScreen from './CreateEventScreen'; // Import the new screen
import { Event, EventType } from '../types'; // Import types

// Helper to create dates for today
const now = new Date();
const today = (h: number, m = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
const yesterday = (h: number, m = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, h, m);
const tomorrow = (h: number, m = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m);


const allEvents: Event[] = [
    {
        id: '1',
        title: 'Global Youth Conference 2024',
        date: 'Ongoing Today',
        startTime: today(now.getHours() - 2), // Started 2 hours ago
        endTime: today(now.getHours() + 3),   // Ends in 3 hours
        location: 'Online via Zoom (Hosted from Sydney)',
        description: 'A 3-day virtual event connecting young believers from across the globe for worship, workshops, and fellowship.',
        type: 'online',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
    {
        id: '2',
        title: 'Hope & Healing Crusade',
        date: 'This Evening',
        startTime: today(19), // Starts at 7 PM today
        endTime: today(22),   // Ends at 10 PM today
        location: 'Los Angeles, CA',
        description: 'Join us for a powerful night of worship and ministry. All are welcome to experience God\'s presence.',
        type: 'offline',
        imageUrl: 'https://images.unsplash.com/photo-1587221391924-5872a13813f8?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
    {
        id: '3',
        title: 'Digital Discipleship Summit',
        date: 'Tomorrow',
        startTime: tomorrow(9), // Starts 9 AM tomorrow
        endTime: tomorrow(17),  // Ends 5 PM tomorrow
        location: 'Online Livestream (Hosted from London)',
        description: 'Learn how to effectively share your faith and build community in the digital age with leading experts.',
        type: 'online',
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
    {
        id: '4',
        title: 'Community Worship in the Park',
        date: 'Finished Yesterday',
        startTime: yesterday(14), // Started 2 PM yesterday
        endTime: yesterday(17),   // Ended 5 PM yesterday
        location: 'Central Park, NYC',
        description: 'An open-air worship gathering for the whole family. Bring a blanket and join us in praise.',
        type: 'offline',
        imageUrl: 'https://images.unsplash.com/photo-1593792272422-ab7623d4b6a8?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
    {
        id: '5',
        title: 'International Pastors & Leaders Conference',
        date: 'January 10-12, 2025',
        startTime: new Date('2025-01-10T09:00:00'),
        endTime: new Date('2025-01-12T18:00:00'),
        location: 'Nairobi, Kenya',
        description: 'Equipping and encouraging church leaders from around the world for greater impact in their communities.',
        type: 'offline',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'private',
    },
     {
        id: '6',
        title: 'Online Bible Study: Book of Romans',
        date: 'Finished Today',
        startTime: today(now.getHours() - 4), // Started 4 hours ago
        endTime: today(now.getHours() - 3),   // Ended 3 hours ago
        location: 'Online via YouTube (Hosted from Dallas)',
        description: 'A weekly deep dive into the Book of Romans. Join our interactive study group.',
        type: 'online',
        imageUrl: 'https://images.unsplash.com/photo-1506462945848-ac8ea6278345?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'private',
    },
];

type Tab = 'all' | 'online' | 'offline';

const getEventStatus = (startTime: Date, endTime: Date) => {
    const now = new Date();

    if (now > endTime) {
        return { text: 'Finished', color: 'bg-gray-500' };
    }
    if (now >= startTime && now <= endTime) {
        return { text: 'Ongoing', color: 'bg-green-500' };
    }
    return { text: 'Upcoming', color: 'bg-brand-blue' };
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const EventCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-pulse">
        <div className="w-full h-32 bg-slate-200 dark:bg-slate-700"></div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-center space-x-2 mb-2">
                <div className="h-2 w-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            
            <div className="mt-2 space-y-2">
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>

            <div className="space-y-2 mt-3 flex-grow">
                 <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                 <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
        </div>
    </div>
);

interface EventsScreenProps {
    onViewEvent: (event: Event) => void;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ onViewEvent }) => {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setEvents(allEvents);
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    
    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        setEvents(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    const handleAddEvent = useCallback((newEvent: Event) => {
        setEvents(prevEvents => [newEvent, ...prevEvents]);
        setIsCreateEventOpen(false);
    }, []);

    const filteredEvents = useMemo(() => {
        if (activeTab === 'all') {
            return events;
        }
        return events.filter(event => event.type === activeTab);
    }, [activeTab, events]);

    const renderTab = (tab: Tab, label: string) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg focus:outline-none transition-colors duration-200 ${
                activeTab === tab 
                ? 'border-b-2 border-brand-blue text-brand-blue' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-5 flex-shrink-0">
                <div className="flex justify-center space-x-4">
                    {renderTab('all', 'All')}
                    {renderTab('online', 'Online')}
                    {renderTab('offline', 'Offline')}
                </div>
            </div>

            {/* Event List */}
            <PullToRefresh onRefresh={handleRefresh}>
                 <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                        <>
                            <EventCardSkeleton />
                            <EventCardSkeleton />
                            <EventCardSkeleton />
                            <EventCardSkeleton />
                        </>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map(event => {
                            const status = getEventStatus(event.startTime, event.endTime);
                            return (
                                <button 
                                    key={event.id}
                                    onClick={() => onViewEvent(event)}
                                    className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden text-left hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                >
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-32 object-cover" />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className={`h-2 w-2 ${status.color} rounded-full`}></span>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                {status.text}
                                                {status.text === 'Ongoing' && ` - Ends at ${formatTime(event.endTime)}`}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{event.title}</h3>
                                        
                                        <div className="mt-2 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 text-center text-base">🗓️</span>
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 text-center text-base">{event.type === 'online' ? '💻' : '📍'}</span>
                                                <span>{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm flex-grow line-clamp-2">{event.description}</p>
                                    </div>
                                </button>
                            )
                        })
                    ) : (
                        <div className="text-center py-10 md:col-span-2">
                            <p className="text-slate-500 dark:text-slate-400">No {activeTab} events found.</p>
                        </div>
                    )}
                </div>
            </PullToRefresh>
             <button
                onClick={() => setIsCreateEventOpen(true)}
                className="fixed bottom-20 right-6 bg-brand-gold text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 focus:outline-none transition-transform hover:scale-105 z-20"
                aria-label="Create Event"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            {isCreateEventOpen && <CreateEventScreen onClose={() => setIsCreateEventOpen(false)} onAddEvent={handleAddEvent} />}
        </div>
    );
};

export default EventsScreen;