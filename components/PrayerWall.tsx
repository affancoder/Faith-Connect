import React from 'react';
// Fix: Add User to imports for the onOpenUserProfile prop
import { Post, User } from '../types';
import MainPostCard from './PrayerCard';
import GlobalPostCard from './GlobalPostCard';

interface PostWallProps {
    posts: Post[];
    onPray: (id: string) => void;
    cardType: 'main' | 'global';
    following?: Set<string>;
    onFollow?: (userId: string) => void;
    onOpenUserProfile?: (user: User) => void;
}

const PostWall: React.FC<PostWallProps> = ({ posts, onPray, cardType, following, onFollow, onOpenUserProfile }) => {
    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No posts yet. Be the first to share!</p>
                </div>
            ) : (
                posts.map(post => {
                    if (cardType === 'global') {
                        return <GlobalPostCard key={post.id} post={post} onPray={onPray} following={following} onFollow={onFollow} onOpenUserProfile={onOpenUserProfile} />;
                    }
                    return <MainPostCard key={post.id} post={post} onPray={onPray} />;
                })
            )}
        </div>
    );
};

export default PostWall;