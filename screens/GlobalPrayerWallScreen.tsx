import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Post, PrayerCategory, User } from '../types';
import PostForm from '../components/PrayerRequestForm';
import PostWall from '../components/PrayerWall';
import PullToRefresh from '../components/PullToRefresh';
import { moderatePrayerRequest } from '../services/geminiService';

const initialGlobalPosts: Post[] = [
    {
        id: 'g1',
        userId: 'kenji',
        name: 'Kenji T.',
        avatarUrl: 'https://i.pravatar.cc/100?u=kenji',
        followerCount: 8100,
        request: 'Prayers for our community in Japan facing recent floods. For safety, strength, and swift aid for all affected families.',
        category: PrayerCategory.OTHER,
        prayerCount: 189,
        commentsCount: 23,
        sharesCount: 11,
        timestamp: new Date(Date.now() - 18000000), // 5 hours ago
        type: 'image',
        imageUrl: 'https://placehold.co/1080x1350/60a5fa/ffffff?text=Pray+for+Japan',
    },
    {
        id: 'g2',
        userId: 'anya',
        name: 'Anya P.',
        avatarUrl: 'https://i.pravatar.cc/100?u=anya',
        followerCount: 15200,
        request: 'Thankful for a successful harvest season in our village. We praise God for His provision and sustenance.',
        category: PrayerCategory.THANKSGIVING,
        prayerCount: 256,
        commentsCount: 45,
        sharesCount: 19,
        timestamp: new Date(Date.now() - 36000000), // 10 hours ago
        type: 'text',
    },
    {
        id: 'g3',
        userId: 'pastor',
        name: 'Pastor Samuel',
        avatarUrl: 'https://i.pravatar.cc/100?u=pastor',
        followerCount: 210500,
        request: 'Pray for wisdom and unity for church leaders gathering at the global conference in Nairobi this week.',
        category: PrayerCategory.GUIDANCE,
        prayerCount: 412,
        commentsCount: 98,
        sharesCount: 56,
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        type: 'image',
        imageUrl: 'https://placehold.co/1080x1350/d97706/ffffff?text=Global+Conference',
    }
];

const dailyVerses = [
    { text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
    { text: "The Lord is my shepherd, I lack nothing.", reference: "Psalm 23:1" },
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", reference: "John 3:16" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
    { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
    { text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.", reference: "Lamentations 3:22-23" },
];

const getVerseOfTheDay = () => {
    const now = new Date();
    const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    const verseIndex = daysSinceEpoch % dailyVerses.length;
    return dailyVerses[verseIndex];
};

interface GlobalPrayerWallScreenProps {
    following: Set<string>;
    onFollow: (userId: string) => void;
    currentUser: User;
    onOpenUserProfile: (user: User) => void;
}

const GlobalPrayerWallScreen: React.FC<GlobalPrayerWallScreenProps> = ({ following, onFollow, currentUser, onOpenUserProfile }) => {
    const [posts, setPosts] = useState<Post[]>(initialGlobalPosts);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [moderationResult, setModerationResult] = useState<{ isPrayerRequest: boolean; isAppropriate: boolean; reason: string } | null>(null);

    const verseOfTheDay = useMemo(() => getVerseOfTheDay(), []);

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

    const handleAddPost = async (newPostData: Omit<Post, 'id' | 'prayerCount' | 'timestamp' | 'avatarUrl' | 'userId'>) => {
        setIsSubmitting(true);
        setModerationResult(null);
        
        const moderation = await moderatePrayerRequest(newPostData.request);
        
        if (!moderation.isPrayerRequest || !moderation.isAppropriate) {
            setModerationResult(moderation);
            setIsSubmitting(false);
            return;
        }

        const newPost: Post = {
            ...newPostData,
            id: `g-${Date.now()}`,
            userId: currentUser.id,
            name: newPostData.name || currentUser.name,
            avatarUrl: currentUser.avatarUrl,
            followerCount: currentUser.followerCount,
            prayerCount: 0,
            timestamp: new Date(),
        };

        setPosts(prev => [newPost, ...prev]);
        setIsSubmitting(false);
        setIsFormVisible(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-950">
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center justify-center">
                    <h1 className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.586-.586a2 2 0 012.828 0l2 2a2 2 0 010 2.828l-5 5A2 2 0 017 13.586V12a2 2 0 012-2h2.586l.293-.293a1 1 0 000-1.414l-2.586-2.586a2 2 0 00-2.828 0l-.586.586z" />
                        </svg>
                        Global Prayer Wall
                    </h1>
                </div>
            </header>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="p-4 space-y-4">
                    <div className="bg-gradient-to-br from-brand-blue to-blue-400 dark:from-brand-blue/80 dark:to-blue-500/80 text-white p-4 rounded-lg shadow-md">
                        <p className="font-serif italic text-lg">"{verseOfTheDay.text}"</p>
                        <p className="text-right font-semibold mt-2">— {verseOfTheDay.reference}</p>
                    </div>

                    {isFormVisible ? (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            {moderationResult && (!moderationResult.isAppropriate || !moderationResult.isPrayerRequest) && (
                                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 mb-4 rounded" role="alert">
                                    <p className="font-bold">Moderation Feedback</p>
                                    <p className="text-sm">{moderationResult.reason}</p>
                                </div>
                            )}
                            <PostForm onAddPost={handleAddPost} isSubmitting={isSubmitting} />
                            <button onClick={() => { setIsFormVisible(false); setModerationResult(null); }} className="w-full text-center mt-2 text-sm text-slate-500 dark:text-slate-400 hover:underline">Cancel</button>
                        </div>
                    ) : (
                         <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                                <img src={currentUser.avatarUrl} alt="Your avatar" className="h-10 w-10 rounded-full" />
                                <button
                                    onClick={() => setIsFormVisible(true)}
                                    className="flex-grow text-left bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Share a prayer with the world...
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <PostWall
                        posts={posts}
                        onPray={handlePray}
                        cardType="global"
                        following={following}
                        onFollow={onFollow}
                        onOpenUserProfile={onOpenUserProfile}
                    />
                </div>
            </PullToRefresh>
        </div>
    );
};

export default GlobalPrayerWallScreen;