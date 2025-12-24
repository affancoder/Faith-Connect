import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PullToRefresh from '../components/PullToRefresh';

// --- MOCK DATA FOR SEARCH ---

interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
}
const mockUsers: User[] = [
    { id: '1', name: 'David R.', username: 'davidr', avatarUrl: 'https://i.pravatar.cc/100?u=david' },
    { id: '2', name: 'Sarah L.', username: 'sarahlikes', avatarUrl: 'https://i.pravatar.cc/100?u=sarah' },
    { id: '3', name: 'Michael B.', username: 'mikeb', avatarUrl: 'https://i.pravatar.cc/100?u=michael' },
    { id: '4', name: 'Pastor Samuel', username: 'pastorsam', avatarUrl: 'https://i.pravatar.cc/100?u=pastor' },
];

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    type: 'online' | 'offline';
    imageUrl: string;
}
const mockEvents: Event[] = [
    { id: '1', title: 'Global Youth Conference 2024', date: 'Ongoing Today', location: 'Online via Zoom', type: 'online', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=100&h=100&auto=format&fit=crop' },
    { id: '2', title: 'Hope & Healing Crusade', date: 'This Evening', location: 'Los Angeles, CA', type: 'offline', imageUrl: 'https://images.unsplash.com/photo-1587221391924-5872a13813f8?q=80&w=100&h=100&auto=format&fit=crop' },
    { id: '3', title: 'Digital Discipleship Summit', date: 'Tomorrow', location: 'Online Livestream', type: 'online', imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=100&h=100&auto=format&fit=crop' },
];

interface Group {
    id: string;
    name: string;
    memberCount: number;
    avatarUrl: string;
}
const mockGroups: Group[] = [
    { id: 'g1', name: 'Youth Fellowship', memberCount: 150, avatarUrl: 'https://placehold.co/100x100/34d399/ffffff?text=YF' },
    { id: 'g2', name: 'Bible Study Group', memberCount: 45, avatarUrl: 'https://placehold.co/100x100/fb923c/ffffff?text=BS' },
    { id: 'g3', name: 'Mission Trip Volunteers', memberCount: 88, avatarUrl: 'https://placehold.co/100x100/60a5fa/ffffff?text=MV' },
];

interface DiscoverPostType {
    id: number;
    type: 'image' | 'video';
    imageUrl: string;
    caption: string;
    prayerCount: number;
    commentCount: number;
    size?: 'large';
}

const mockDiscoverPosts: DiscoverPostType[] = [
    { id: 1, type: 'image' as const, imageUrl: 'https://images.unsplash.com/photo-1593106578502-28691da5ff5e?q=80&w=600&h=600&auto=format&fit=crop', caption: "A beautiful sunset over the mountains.", prayerCount: 1250, commentCount: 88, size: 'large' },
    { id: 2, type: 'image' as const, imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=400&h=400&auto=format&fit=crop', caption: "Praising God for his creation.", prayerCount: 450, commentCount: 32 },
    { id: 3, type: 'video' as const, imageUrl: 'https://images.unsplash.com/photo-1516589178581-6e8a6ceea3d9?q=80&w=400&h=400&auto=format&fit=crop', caption: "Worship session from last night.", prayerCount: 2103, commentCount: 150 },
    { id: 4, type: 'image' as const, imageUrl: 'https://images.unsplash.com/photo-1542223616-72c83c3ea064?q=80&w=400&h=400&auto=format&fit=crop', caption: "Quiet time with the Word.", prayerCount: 89, commentCount: 12 },
    { id: 5, type: 'image' as const, imageUrl: 'https://images.unsplash.com/photo-1558280139-2f5145a35439?q=80&w=400&h=400&auto=format&fit=crop', caption: "Fellowship with brothers and sisters.", prayerCount: 672, commentCount: 45 },
    { id: 6, type: 'image' as const, imageUrl: 'https://images.unsplash.com/photo-1519790363234-a8a8a4810b42?q=80&w=400&h=400&auto=format&fit=crop', caption: "Pray for our city.", prayerCount: 301, commentCount: 22 },
];

// --- SEARCH RESULT COMPONENTS ---

const SearchResultSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h2 className="px-4 pb-2 text-base font-bold text-slate-800 dark:text-slate-200">{title}</h2>
        {children}
    </div>
);

const UserResult: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-3 p-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
        <img src={user.avatarUrl} alt={user.name} className="h-11 w-11 rounded-full" />
        <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{user.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
        </div>
    </div>
);
const EventResult: React.FC<{ event: Event }> = ({ event }) => (
    <div className="flex items-center space-x-3 p-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
        <img src={event.imageUrl} alt={event.title} className="h-11 w-11 rounded-lg object-cover" />
        <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{event.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{event.location}</p>
        </div>
    </div>
);
const GroupResult: React.FC<{ group: Group }> = ({ group }) => (
     <div className="flex items-center space-x-3 p-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
        <img src={group.avatarUrl} alt={group.name} className="h-11 w-11 rounded-lg object-cover" />
        <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{group.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{group.memberCount.toLocaleString()} members</p>
        </div>
    </div>
);
const PostResult: React.FC<{ post: DiscoverPostType }> = ({ post }) => (
     <div className="flex items-center space-x-3 p-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
        <img src={post.imageUrl} alt={post.caption} className="h-11 w-11 rounded-lg object-cover" />
        <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{post.caption}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{post.prayerCount.toLocaleString()} prayers</p>
        </div>
    </div>
);

// --- DISCOVER GRID COMPONENT ---
const DiscoverPost: React.FC<{ post: DiscoverPostType }> = ({ post }) => {
    const sizeClasses = post.size === 'large' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
    return (
        <div className={`relative group cursor-pointer aspect-square ${sizeClasses}`}>
            <img src={post.imageUrl} alt="Discover post" className="w-full h-full object-cover" />
            {post.type === 'video' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white absolute top-2 right-2 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center space-x-4 text-white font-bold text-sm">
                    <div className="flex items-center space-x-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.787l.09.044a2 2 0 002.208-.442l.149-.194a2 2 0 012.392-.412l.152.05a2 2 0 001.994.093l.268-.108a2 2 0 001.622-1.992V10.5a1.5 1.5 0 113 0v6a4.5 4.5 0 01-4.5 4.5H10.333a4.5 4.5 0 01-4.167-3.264L6 10.333zM17 6.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6z" /></svg>
                        <span>{post.prayerCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
                        <span>{post.commentCount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DISCOVER SCREEN ---
interface SearchResults {
    users: User[];
    events: Event[];
    groups: Group[];
    posts: DiscoverPostType[];
}

const DiscoverScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState(mockDiscoverPosts);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        setPosts(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults(null);
            return;
        }
        setIsSearching(true);
        const searchTimer = setTimeout(() => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const results: SearchResults = {
                users: mockUsers.filter(u => u.name.toLowerCase().includes(lowercasedTerm) || u.username.toLowerCase().includes(lowercasedTerm)),
                events: mockEvents.filter(e => e.title.toLowerCase().includes(lowercasedTerm) || e.location.toLowerCase().includes(lowercasedTerm)),
                groups: mockGroups.filter(g => g.name.toLowerCase().includes(lowercasedTerm)),
                posts: mockDiscoverPosts.filter(p => p.caption.toLowerCase().includes(lowercasedTerm)),
            };
            setSearchResults(results);
            setIsSearching(false);
        }, 300); // Debounce search

        return () => clearTimeout(searchTimer);
    }, [searchTerm]);
    
    const handleCancelSearch = () => {
        setSearchTerm('');
        setIsSearchActive(false);
        setSearchResults(null);
    };

    const hasResults = searchResults && (searchResults.users.length + searchResults.events.length + searchResults.groups.length + searchResults.posts.length > 0);

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950">
            <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="search"
                            placeholder="Search users, events, groups..."
                            value={searchTerm}
                            onFocus={() => setIsSearchActive(true)}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent dark:text-slate-200"
                        />
                    </div>
                    {isSearchActive && (
                        <button onClick={handleCancelSearch} className="text-sm font-medium text-slate-700 dark:text-slate-300">Cancel</button>
                    )}
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto pb-16 scrollbar-hide">
                {isSearchActive ? (
                    <div>
                        {isSearching ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue"></div>
                            </div>
                        ) : hasResults ? (
                            <div className="py-2">
                                {searchResults.users.length > 0 && (
                                    <SearchResultSection title="Profiles">
                                        {searchResults.users.map(user => <UserResult key={user.id} user={user} />)}
                                    </SearchResultSection>
                                )}
                                {searchResults.events.length > 0 && (
                                    <SearchResultSection title="Events">
                                        {searchResults.events.map(event => <EventResult key={event.id} event={event} />)}
                                    </SearchResultSection>
                                )}
                                {searchResults.groups.length > 0 && (
                                    <SearchResultSection title="Groups">
                                        {searchResults.groups.map(group => <GroupResult key={group.id} group={group} />)}
                                    </SearchResultSection>
                                )}
                                {searchResults.posts.length > 0 && (
                                    <SearchResultSection title="Posts">
                                        {searchResults.posts.map(post => <PostResult key={post.id} post={post} />)}
                                    </SearchResultSection>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No results found</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">Try a different search term for users, events or posts.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <PullToRefresh onRefresh={handleRefresh}>
                         <div className="grid grid-cols-3 auto-rows-fr gap-0.5">
                            {posts.map(post => (
                                <DiscoverPost key={post.id} post={post} />
                            ))}
                        </div>
                    </PullToRefresh>
                )}
            </main>
        </div>
    );
};

export default DiscoverScreen;