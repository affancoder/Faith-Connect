import React, { useState, useCallback } from 'react';
import { Post, User } from '../types';
import MainPostCard from './PrayerCard';
import GlobalPostCard from './GlobalPostCard';

interface ViewPostModalProps {
    post: Post;
    onClose: () => void;
    following: Set<string>;
    onFollow: (userId: string) => void;
    onOpenUserProfile: (user: User) => void;
}

const ViewPostModal: React.FC<ViewPostModalProps> = ({ post, onClose, following, onFollow, onOpenUserProfile }) => {
    // This modal renders a single post card and manages its own prayer state locally.
    const [localPost, setLocalPost] = useState(post);

    const handlePray = useCallback((id: string) => {
        if (id === localPost.id) {
            setLocalPost(p => ({ ...p, prayerCount: p.prayerCount + 1 }));
        }
    }, [localPost.id]);

    const renderCard = () => {
        // Always render the more feature-rich card in this modal context to ensure
        // consistent functionality like clickable user profiles and follow buttons.
        return <GlobalPostCard post={localPost} onPray={handlePray} following={following} onFollow={onFollow} onOpenUserProfile={onOpenUserProfile} />;
    };

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col animate-slide-in-up">
            <header className="flex-shrink-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 h-14 flex items-center">
                    <button onClick={onClose} className="p-2 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-4">Post</h1>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto scrollbar-hide p-4">
                {renderCard()}
            </main>
        </div>
    );
};

export default ViewPostModal;