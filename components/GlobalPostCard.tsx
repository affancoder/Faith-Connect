import React, { useState } from 'react';
import { Post, User } from '../types';

interface GlobalPostCardProps {
    post: Post;
    onPray: (id: string) => void;
    following?: Set<string>;
    onFollow?: (userId: string) => void;
    onOpenUserProfile?: (user: User) => void;
}

const GlobalPostCard: React.FC<GlobalPostCardProps> = ({ post, onPray, following, onFollow, onOpenUserProfile }) => {
    const { id, userId, name, request, prayerCount, timestamp, type, imageUrl, videoUrl, avatarUrl, followerCount } = post;
    const [isPrayed, setIsPrayed] = useState(false);

    const isFollowing = following?.has(userId);

    const handlePrayClick = () => {
        if (!isPrayed) {
            onPray(id);
            setIsPrayed(true);
        }
    };

    const handleUserClick = () => {
        if (onOpenUserProfile) {
            // Construct a partial User object from the Post data for navigation
            onOpenUserProfile({
                id: userId,
                name: name,
                avatarUrl: avatarUrl,
                followerCount: followerCount
            });
        }
    };
    
    const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const renderMedia = () => {
        if (type === 'image' && imageUrl) {
            return <img src={imageUrl} alt="Prayer post" className="w-full h-auto rounded-lg" />;
        }
        if (type === 'video' && videoUrl) {
            return <video src={videoUrl} controls className="w-full h-auto rounded-lg" />;
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-4">
             {/* Card Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <button onClick={handleUserClick} className="flex-shrink-0">
                        <img src={avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-1">
                            <button onClick={handleUserClick} className="font-semibold text-sm text-slate-800 dark:text-slate-200 hover:underline">{name}</button>
                            {followerCount && followerCount >= 10000 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" /></svg>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(timestamp)}</p>
                    </div>
                </div>
                <div>
                    {userId !== 'currentuser-global' && onFollow && (
                         <button
                            onClick={() => onFollow(userId)}
                            className={`text-sm font-semibold px-4 py-1 rounded-lg transition-colors ${isFollowing ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600' : 'bg-brand-blue text-white hover:bg-opacity-90'}`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="my-3 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-800/40 p-4 border border-amber-200 dark:border-amber-700/50">
                <p className="text-amber-900 dark:text-amber-200 whitespace-pre-wrap text-base">{request}</p>
            </div>
            {renderMedia()}
            
            {/* Actions & Info */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <button 
                    onClick={handlePrayClick} 
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${isPrayed ? 'bg-blue-100 dark:bg-brand-blue/20 text-brand-blue' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.787l.09.044a2 2 0 002.208-.442l.149-.194a2 2 0 012.392-.412l.152.05a2 2 0 001.994.093l.268-.108a2 2 0 001.622-1.992V10.5a1.5 1.5 0 113 0v6a4.5 4.5 0 01-4.5 4.5H10.333a4.5 4.5 0 01-4.167-3.264L6 10.333zM17 6.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6z" />
                    </svg>
                    <span className="text-sm font-semibold">{isPrayed ? 'Prayed' : 'Pray'}</span>
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">{prayerCount} prayers</span>
            </div>
        </div>
    );
};

export default GlobalPostCard;