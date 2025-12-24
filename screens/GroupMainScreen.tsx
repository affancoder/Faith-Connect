import React, { useState, useCallback } from 'react';
import { Group, Post, PrayerCategory } from '../types';
import PullToRefresh from '../components/PullToRefresh';
import PrayerCard from '../components/PrayerCard';

// Mock posts for the group feed, tailored to a youth group context
const initialGroupPosts: Post[] = [
    {
        id: 'gp1',
        userId: 'david',
        name: 'David R.',
        avatarUrl: 'https://i.pravatar.cc/100?u=david',
        followerCount: 500,
        request: "Hey everyone! Don't forget our weekly meeting this Friday at 7 PM. We'll be discussing the next chapter of John. Bring a friend!",
        category: PrayerCategory.OTHER,
        prayerCount: 22,
        commentsCount: 5,
        sharesCount: 2,
        timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        type: 'text'
    },
    {
        id: 'gp2',
        userId: 'sarah',
        name: 'Sarah L.',
        avatarUrl: 'https://i.pravatar.cc/100?u=sarah',
        followerCount: 10001,
        request: "Praying for everyone's exams this week. May God grant you clarity and peace. You've got this!",
        category: PrayerCategory.GUIDANCE,
        prayerCount: 105,
        commentsCount: 18,
        sharesCount: 7,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop'
    }
];

interface GroupMainScreenProps {
    group: Group;
    onClose: () => void;
}

const GroupMainScreen: React.FC<GroupMainScreenProps> = ({ group, onClose }) => {
    const [isJoined, setIsJoined] = useState(group.isJoined);
    const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
    const [posts, setPosts] = useState<Post[]>(isJoined || group.privacy === 'public' ? initialGroupPosts : []);

    const handleJoinToggle = () => {
        setIsJoined(prev => !prev);
    };

    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        setPosts(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    const handlePray = useCallback((id: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === id ? { ...post, prayerCount: post.prayerCount + 1 } : post
            )
        );
    }, []);
    
    const showContent = isJoined || group.privacy !== 'private';

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">{group.name}</h1>
                    <button className="p-2 -mr-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${group.avatarUrl})` }}></div>
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{group.name}</h2>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {group.privacy === 'private' ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        }
                        <span>{group.privacy === 'private' ? 'Private Group' : 'Public Group'}</span>
                        <span>&middot;</span>
                        <span>{group.memberCount.toLocaleString()} members</span>
                    </div>
                    <button onClick={handleJoinToggle} className={`w-full mt-4 font-semibold py-2 rounded-lg text-sm transition-colors ${isJoined ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : 'bg-brand-blue text-white'}`}>
                        {group.privacy === 'private' && !isJoined ? 'Request to Join' : isJoined ? 'Joined' : 'Join Group'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-14 z-10">
                    <div className="flex justify-around">
                        <button onClick={() => setActiveTab('feed')} className={`py-3 px-1 border-b-2 ${activeTab === 'feed' ? 'border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-500 dark:text-slate-400'} font-semibold text-sm`}>Feed</button>
                        <button onClick={() => setActiveTab('members')} className={`py-3 px-1 border-b-2 ${activeTab === 'members' ? 'border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-500 dark:text-slate-400'} font-semibold text-sm`}>Members</button>
                        <button onClick={() => setActiveTab('about')} className={`py-3 px-1 border-b-2 ${activeTab === 'about' ? 'border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-500 dark:text-slate-400'} font-semibold text-sm`}>About</button>
                    </div>
                </div>

                {/* Content based on tab */}
                {showContent ? (
                    <>
                        {activeTab === 'feed' && (
                             <PullToRefresh onRefresh={handleRefresh}>
                                <div className="p-4 space-y-4">
                                     <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            <img src="https://i.pravatar.cc/100?u=currentuser" alt="Your avatar" className="h-10 w-10 rounded-full" />
                                            <div className="flex-grow text-left bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-slate-500 dark:text-slate-400">
                                                What's on your mind?
                                            </div>
                                        </div>
                                    </div>
                                    {posts.map(post => <PrayerCard key={post.id} post={post} onPray={handlePray} />)}
                                </div>
                             </PullToRefresh>
                        )}
                         {activeTab === 'members' && <div className="p-8 text-center text-slate-500 dark:text-slate-400">Members list coming soon.</div>}
                         {activeTab === 'about' && <div className="p-8 text-slate-700 dark:text-slate-300">{group.description || 'No description provided.'}</div>}
                    </>
                ) : (
                    <div className="p-8 text-center flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">This Group is Private</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Request to join this group to see its posts and discussions.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GroupMainScreen;