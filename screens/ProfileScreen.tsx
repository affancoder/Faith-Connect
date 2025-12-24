import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Post, PrayerCategory, User } from '../types';
import PullToRefresh from '../components/PullToRefresh';

// --- MOCK DATA ---
// A larger, centralized mock data source for all users' posts and reels (video posts).
const allMockPosts: Post[] = [
    // Current User's Posts
    { id: 'p1', userId: 'currentuser', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/100?u=currentuser', request: 'Grateful for another beautiful day!', category: PrayerCategory.THANKSGIVING, prayerCount: 112, commentsCount: 15, sharesCount: 3, timestamp: new Date(Date.now() - 86400000 * 2), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=400&h=400&auto=format&fit=crop' },
    { id: 'p2', userId: 'currentuser', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/100?u=currentuser', request: 'Praying for strength this week.', category: PrayerCategory.GUIDANCE, prayerCount: 250, commentsCount: 40, sharesCount: 11, timestamp: new Date(Date.now() - 86400000 * 5), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop' },
    { id: 'p3', userId: 'currentuser', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/100?u=currentuser', request: 'Family is everything.', category: PrayerCategory.FAMILY, prayerCount: 480, commentsCount: 88, sharesCount: 20, timestamp: new Date(Date.now() - 86400000 * 10), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1580129958613-a327d7918128?q=80&w=400&h=400&auto=format&fit=crop' },
    { id: 'p4', userId: 'currentuser', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/100?u=currentuser', request: 'A moment of peace.', category: PrayerCategory.OTHER, prayerCount: 95, commentsCount: 12, sharesCount: 1, timestamp: new Date(Date.now() - 86400000 * 12), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=400&h=400&auto=format&fit=crop' },
    // Current User's Reel (Video Post)
    { id: 'r1', userId: 'currentuser', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/100?u=currentuser', request: 'Quick recap of our youth group event!', category: PrayerCategory.OTHER, prayerCount: 1300, commentsCount: 150, sharesCount: 45, timestamp: new Date(Date.now() - 86400000 * 3), type: 'video', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&h=400&auto=format&fit=crop' }, // Using an image as a thumbnail
    // Other Users' Posts
    { id: 'p_bhawna1', userId: 'bhawna', name: 'bhawna_gera02', avatarUrl: 'https://i.pravatar.cc/100?u=grace', request: 'Men ✔️ boy ❌.. YES she is absolutely correct ...', category: PrayerCategory.OTHER, prayerCount: 962, commentsCount: 1802, sharesCount: 88, timestamp: new Date(Date.now() - 86400000), type: 'video', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', imageUrl: 'https://images.unsplash.com/photo-1593106578502-28691da5ff5e?q=80&w=400&h=400&auto=format&fit=crop' },
    { id: 'p_samuel1', userId: 'samuel', name: 'Samuel K.', avatarUrl: 'https://i.pravatar.cc/100?u=samuel', request: 'My testimony from this week\'s mission trip. We saw incredible things!', category: PrayerCategory.THANKSGIVING, prayerCount: 2501, commentsCount: 340, sharesCount: 121, timestamp: new Date(Date.now() - 86400000 * 2), type: 'video', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', imageUrl: 'https://images.unsplash.com/photo-1519790363234-a8a8a4810b42?q=80&w=400&h=400&auto=format&fit=crop' },
    { id: 'p_hope1', userId: 'hope', name: 'Hope Community', avatarUrl: 'https://i.pravatar.cc/100?u=hope', request: 'A recap of our youth group event this past weekend. So much joy!', category: PrayerCategory.OTHER, prayerCount: 890, commentsCount: 95, sharesCount: 45, timestamp: new Date(Date.now() - 86400000 * 4), type: 'video', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', imageUrl: 'https://images.unsplash.com/photo-1558280139-2f5145a35439?q=80&w=400&h=400&auto=format&fit=crop' },
    { id: 'p_pastor1', userId: 'pastor', name: 'Pastor Samuel', avatarUrl: 'https://i.pravatar.cc/100?u=pastor', request: 'Sunday sermon is now available online.', category: PrayerCategory.OTHER, prayerCount: 500, commentsCount: 30, sharesCount: 15, timestamp: new Date(Date.now() - 86400000 * 1), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=400&h=400&auto=format&fit=crop' },
];

const mockSavedPosts: string[] = ['p_samuel1', 'p_hope1', 'p1'];
// --- END MOCK DATA ---


type ProfileTab = 'posts' | 'reels' | 'saved';

interface ProfileScreenProps {
  user: User;
  isCurrentUser: boolean;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  onBack?: () => void;
  following: Set<string>;
  onFollow: (userId: string) => void;
  onOpenInsights?: () => void;
}

const ProfileSkeleton: React.FC = () => (
    <div className="bg-slate-50 dark:bg-black min-h-full animate-pulse">
        <header className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 h-14 flex items-center">
                <div className="p-2 -ml-2 h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-grow text-center">
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
                </div>
                <div className="w-6"></div>
            </div>
        </header>
        <div className="container mx-auto max-w-4xl">
            <section className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 bg-white dark:bg-slate-900 p-6 rounded-b-lg shadow-sm border-x border-b border-slate-200 dark:border-slate-700">
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                <div className="flex-grow w-full">
                    <div className="sm:flex items-center gap-4">
                        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mx-auto sm:mx-0"></div>
                        <div className="mt-2 sm:mt-0 flex justify-center sm:justify-start space-x-2">
                            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-8 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center sm:justify-start space-x-6">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="mt-4 space-y-2 max-w-md mx-auto sm:mx-0">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                </div>
            </section>
            <main className="mt-1">
                <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-lg">
                    <div className="h-12 flex justify-center space-x-8">
                        <div className="w-20 h-full border-b-2 border-slate-800 dark:border-slate-200"></div>
                        <div className="w-20 h-full"></div>
                        <div className="w-20 h-full"></div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-900 p-1 rounded-b-lg">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800"></div>
                    ))}
                </div>
            </main>
        </div>
    </div>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, isCurrentUser, onEditProfile, onOpenSettings, onOpenFollowers, onOpenFollowing, onBack, following, onFollow, onOpenInsights }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
    const [isLoading, setIsLoading] = useState(true);
    
    // State for user-specific content
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userReels, setUserReels] = useState<Post[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    
    const isFollowing = !isCurrentUser && following.has(user.id);

    const handleFollowClick = () => {
        if (!isCurrentUser) {
            onFollow(user.id);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            // Filter all mock posts to get content for the specific user
            const postsForUser = allMockPosts.filter(p => p.userId === user.id);
            setUserPosts(postsForUser.filter(p => p.type === 'image'));
            setUserReels(postsForUser.filter(p => p.type === 'video'));

            // Load saved posts only for the current user
            if (isCurrentUser) {
                const saved = allMockPosts.filter(p => mockSavedPosts.includes(p.id));
                setSavedPosts(saved);
            }
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [user.id, isCurrentUser]);

    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1000));
        // Simple shuffle to simulate refresh
        setUserPosts(prev => [...prev].sort(() => Math.random() - 0.5));
        setUserReels(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    const renderGrid = (postsToRender: Post[], emptyState: React.ReactNode) => {
        if (postsToRender.length === 0) {
            return emptyState;
        }
        return (
            <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-900 p-1 rounded-b-lg">
                {postsToRender.map(post => (
                    <div key={post.id} className="aspect-square bg-slate-200 dark:bg-slate-800 relative group overflow-hidden">
                        <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
                         {post.type === 'video' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white absolute top-2 right-2 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className={`bg-slate-50 dark:bg-black h-full flex flex-col ${onBack ? 'fixed inset-0 z-50' : ''}`}>
             <header className="flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm z-10 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    {onBack ? (
                        <button onClick={onBack} className="p-2 -ml-2" aria-label="Go back">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    ) : (
                        <div className="w-6"></div> // Spacer to keep title centered
                    )}

                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">{user.name}</h1>

                    <div className="w-6"></div>
                </div>
            </header>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="container mx-auto max-w-4xl">
                    {/* Profile Header */}
                    <section className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 bg-white dark:bg-slate-900 p-6 rounded-b-lg shadow-sm border-x border-b border-slate-200 dark:border-slate-700">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-28 w-28 sm:h-36 sm:w-36 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-md flex-shrink-0"
                        />
                        <div className="flex-grow w-full">
                            <div className="sm:flex sm:items-start sm:justify-between">
                                <div className="text-center sm:text-left">
                                    <div className="flex items-baseline justify-center sm:justify-start gap-2">
                                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h2>
                                        {user.pronouns && <span className="text-base text-slate-500 dark:text-slate-400">{user.pronouns}</span>}
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                        {user.username && <p className="text-lg text-slate-600 dark:text-slate-400">@{user.username}</p>}
                                        {user.followerCount && user.followerCount >= 10000 && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                    {user.isProfessional && user.professionalCategory && user.displayCategory && (
                                        <p className="text-sm font-semibold text-brand-blue mt-1">{user.professionalCategory}</p>
                                    )}
                                </div>
                                
                                {isCurrentUser ? (
                                    <div className="mt-4 sm:mt-0 flex justify-center sm:justify-start space-x-2 flex-shrink-0">
                                        {user.isProfessional && <button onClick={onOpenInsights} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Insights</button>}
                                        <button onClick={onEditProfile} className="bg-brand-blue text-white font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-opacity-90 transition-colors">Edit Profile</button>
                                        <button onClick={onOpenSettings} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-2 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label="Settings"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                                    </div>
                                ) : (
                                    <div className="mt-4 sm:mt-0 flex justify-center sm:justify-start space-x-2 flex-shrink-0">
                                        <button onClick={handleFollowClick} className={`font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors ${isFollowing ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600' : 'bg-brand-blue text-white hover:bg-opacity-90'}`}>{isFollowing ? 'Following' : 'Follow'}</button>
                                        <button className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Message</button>
                                        {user.isProfessional && user.displayContact && user.email && (
                                            <a href={`mailto:${user.email}`} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Email</a>
                                        )}
                                        {user.isProfessional && user.displayContact && user.phone && (
                                            <a href={`tel:${user.phone}`} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Call</a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-center sm:justify-start space-x-6 text-sm">
                                <div><span className="font-bold text-slate-800 dark:text-slate-200 text-base">{userPosts.length + userReels.length}</span><span className="text-slate-500 dark:text-slate-400 ml-1">Posts</span></div>
                                <button onClick={onOpenFollowers}><span className="font-bold text-slate-800 dark:text-slate-200 text-base">{user.followerCount?.toLocaleString() || '0'}</span><span className="text-slate-500 dark:text-slate-400 ml-1">Followers</span></button>
                                <button onClick={onOpenFollowing}><span className="font-bold text-slate-800 dark:text-slate-200 text-base">{user.followingCount?.toLocaleString() || '0'}</span><span className="text-slate-500 dark:text-slate-400 ml-1">Following</span></button>
                            </div>
                            {user.bio && <p className="mt-4 text-slate-700 dark:text-slate-300 max-w-md mx-auto sm:mx-0">{user.bio}</p>}
                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 space-y-2 max-w-md mx-auto sm:mx-0">
                                {user.church && (
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        <span className="dark:text-slate-300">Member at <b>{user.church}</b></span>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="dark:text-slate-300">Lives in <b>{user.location}</b></span>
                                    </div>
                                )}
                                {user.denomination && (
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                        <span className="dark:text-slate-300">Denomination: <b>{user.denomination}</b></span>
                                    </div>
                                )}
                                {user.websiteLink && (
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        <a href={user.websiteLink} target="_blank" rel="noopener noreferrer" className="text-brand-blue font-semibold hover:underline truncate">
                                            {user.websiteLink.replace(/^(https?:\/\/)?(www\.)?/, '')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Profile Content */}
                    <main className="mt-4 pb-4">
                        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-lg">
                            <nav className="-mb-px flex justify-center space-x-8">
                                <button onClick={() => setActiveTab('posts')} className={`py-3 px-1 border-b-2 ${activeTab === 'posts' ? 'border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-500 dark:text-slate-400'} font-semibold text-sm flex items-center gap-2`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>POSTS</button>
                                <button onClick={() => setActiveTab('reels')} className={`py-3 px-1 border-b-2 ${activeTab === 'reels' ? 'border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-500 dark:text-slate-400'} font-semibold text-sm flex items-center gap-2`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>REELS</button>
                                {isCurrentUser && <button onClick={() => setActiveTab('saved')} className={`py-3 px-1 border-b-2 ${activeTab === 'saved' ? 'border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200' : 'border-transparent text-slate-500 dark:text-slate-400'} font-semibold text-sm flex items-center gap-2`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>SAVED</button>}
                            </nav>
                        </div>
                        
                        {activeTab === 'posts' && renderGrid(userPosts, <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-b-lg"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No Posts Yet</h3><p className="text-slate-500 dark:text-slate-400 mt-2">Posts from {user.name} will appear here.</p></div>)}
                        {activeTab === 'reels' && renderGrid(userReels, <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-b-lg"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No Reels Yet</h3><p className="text-slate-500 dark:text-slate-400 mt-2">Reels from {user.name} will appear here.</p></div>)}
                        {activeTab === 'saved' && isCurrentUser && renderGrid(savedPosts, 
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-b-lg flex flex-col items-center">
                                <div className="w-16 h-16 border-2 border-slate-800 dark:border-slate-300 rounded-full flex items-center justify-center mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-800 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Save</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">Save posts you want to see again. No one is notified, and only you can see what you've saved.</p>
                            </div>
                        )}
                    </main>
                </div>
            </PullToRefresh>
        </div>
    );
};

export default ProfileScreen;