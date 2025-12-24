import React, { useState } from 'react';
import { Event } from '../types';

// Mock data
const now = new Date();
const today = (h: number, m = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
const tomorrow = (h: number, m = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m);

const hostingEvents: Event[] = [
    {
        id: 'host1',
        title: 'Weekly Bible Study',
        date: 'This Evening',
        startTime: today(19),
        endTime: today(20, 30),
        location: 'Online via Zoom',
        description: 'Deep dive into the book of Romans. We will be covering chapters 5-8 this week. All are welcome to join our interactive session. Please come prepared with your notes and questions!',
        type: 'online',
        imageUrl: 'https://images.unsplash.com/photo-1506462945848-ac8ea6278345?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'private',
    }
];

const goingEvents: Event[] = [
    {
        id: '2',
        title: 'Hope & Healing Crusade',
        date: 'This Evening',
        startTime: today(19),
        endTime: today(22),
        location: 'Los Angeles, CA',
        description: 'Join us for a powerful night of worship and ministry with guest speaker Pastor John Mark. All are welcome to experience God\'s presence and receive prayer.',
        type: 'offline',
        imageUrl: 'https://images.unsplash.com/photo-1587221391924-5872a13813f8?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
    {
        id: '3',
        title: 'Digital Discipleship Summit',
        date: 'Tomorrow',
        startTime: tomorrow(9),
        endTime: tomorrow(17),
        location: 'Online Livestream',
        description: 'Learn how to effectively share your faith and build community in the digital age with leading experts from around the world. Sessions on social media, content creation, and online ministry.',
        type: 'online',
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
];

const savedEvents: Event[] = [
    {
        id: '5',
        title: 'International Pastors & Leaders Conference',
        date: 'January 10-12, 2025',
        startTime: new Date('2025-01-10T09:00:00'),
        endTime: new Date('2025-01-12T18:00:00'),
        location: 'Nairobi, Kenya',
        description: 'Equipping and encouraging church leaders from around the world for greater impact in their communities. Keynote speakers include world-renowned theologians and ministry leaders.',
        type: 'offline',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&h=400&auto=format&fit=crop',
        privacy: 'public',
    },
];


interface UserEventsScreenProps {
    onClose: () => void;
    onViewEvent: (event: Event) => void;
}

type Tab = 'hosting' | 'going' | 'saved';

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const EventCard: React.FC<{ event: Event; onView: () => void }> = ({ event, onView }) => (
    <button onClick={onView} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex overflow-hidden w-full text-left hover:shadow-md transition-shadow">
        <img src={event.imageUrl} alt={event.title} className="w-24 h-24 object-cover" />
        <div className="p-3 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{event.date} &middot; {formatTime(event.startTime)}</p>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 leading-tight mt-1">{event.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.location}</p>
        </div>
    </button>
);

const UserEventsScreen: React.FC<UserEventsScreenProps> = ({ onClose, onViewEvent }) => {
    const [activeTab, setActiveTab] = useState<Tab>('going');

    const renderTab = (tab: Tab, label: string) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold text-center focus:outline-none transition-colors duration-200 ${
                activeTab === tab 
                ? 'border-b-2 border-brand-blue text-brand-blue' 
                : 'border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
        >
            {label}
        </button>
    );
    
    const renderContent = () => {
        let events: Event[] = [];
        let emptyMessage = "";
        switch(activeTab) {
            case 'hosting':
                events = hostingEvents;
                emptyMessage = "You aren't hosting any events.";
                break;
            case 'going':
                events = goingEvents;
                emptyMessage = "You haven't RSVP'd to any events yet.";
                break;
            case 'saved':
                events = savedEvents;
                emptyMessage = "You don't have any saved events.";
                break;
        }
        
        if (events.length === 0) {
            return (
                <div className="text-center py-20 px-4">
                    <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="p-4 space-y-4">
                {events.map(event => <EventCard key={event.id} event={event} onView={() => onViewEvent(event)} />)}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-black z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 border-b dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center">
                     <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 ml-4">My Events</h1>
                </div>
            </header>
            
            {/* Tabs */}
            <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex justify-around">
                    {renderTab('hosting', 'Hosting')}
                    {renderTab('going', 'Going')}
                    {renderTab('saved', 'Saved')}
                </nav>
            </div>
            
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                {renderContent()}
            </main>
        </div>
    );
};

export default UserEventsScreen;