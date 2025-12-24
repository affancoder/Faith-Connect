import React, { useState, useCallback } from 'react';
import StoryCircles from '../components/StoryCircles';
import CreatePost from '../components/CreatePost';
import HomeFeed from '../components/HomeFeed';
import { Post, PrayerCategory, Story, User } from '../types';

interface HomeScreenProps {
    onOpenSidebar: () => void;
    onOpenNotifications: () => void;
    onOpenChatList: () => void;
    onOpenCreatePost: () => void;
    onOpenCreateStory: () => void;
    onViewStory: (story: Story, allStories: Story[]) => void;
    onOpenMap: () => void;
    following: Set<string>;
    onFollow: (userId: string) => void;
    viewedStories: Set<string>;
}

const initialPosts: Post[] = [
    {
        id: '1',
        userId: 'grace',
        name: 'Grace P.',
        avatarUrl: 'https://i.pravatar.cc/100?u=grace',
        followerCount: 543,
        request: 'Praying for my friend who is going through a tough time with her health. May she feel God\'s healing hands and peace.',
        category: PrayerCategory.HEALING,
        prayerCount: 15,
        commentsCount: 2,
        sharesCount: 1,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        type: 'text'
    },
    {
        id: '2',
        userId: 'samuel',
        name: 'Samuel K.',
        avatarUrl: 'https://i.pravatar.cc/100?u=samuel',
        followerCount: 12501,
        request: 'So thankful for my family. We had a wonderful time together this weekend, making memories and feeling blessed.',
        category: PrayerCategory.THANKSGIVING,
        prayerCount: 42,
        commentsCount: 8,
        sharesCount: 3,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '3',
        userId: 'hope',
        name: 'Hope Community',
        avatarUrl: 'https://i.pravatar.cc/100?u=hope',
        followerCount: 52340,
        request: 'Join us for our weekly Bible study! This week we are diving into the book of John. All are welcome.',
        category: PrayerCategory.OTHER,
        prayerCount: 120,
        commentsCount: 25,
        sharesCount: 12,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        type: 'video',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    }
];

const HomeScreen: React.FC<HomeScreenProps> = ({
    onOpenSidebar,
    onOpenNotifications,
    onOpenChatList,
    onOpenCreatePost,
    onOpenCreateStory,
    onViewStory,
    onOpenMap,
    following,
    onFollow,
    viewedStories,
}) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    const handlePray = useCallback((id: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === id ? { ...post, prayerCount: post.prayerCount + 1 } : post
            )
        );
    }, []);

    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        // Simulate new posts by re-shuffling
        setPosts(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-950">
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={onOpenSidebar} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="font-bold text-2xl text-slate-800 dark:text-slate-100 font-serif">FaithConnect</h1>
                    <div className="flex items-center space-x-2">
                         <button onClick={onOpenNotifications} className="p-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                             <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <button onClick={onOpenChatList} className="p-2 relative">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                             <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                <StoryCircles onViewStory={onViewStory} onOpenCreateStory={onOpenCreateStory} following={following} viewedStories={viewedStories} />
                 <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <CreatePost onOpenForm={onOpenCreatePost} />
                </div>
                <HomeFeed posts={posts} onPray={handlePray} onRefresh={handleRefresh} following={following} onFollow={onFollow}/>
            </main>
        </div>
    );
};

export default HomeScreen;