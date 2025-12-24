import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Post } from '../types';

interface MainPostCardProps {
    post: Post;
    onPray: (id: string) => void;
}

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

// --- MODAL COMPONENTS ---

interface CommentUser {
    name: string;
    avatarUrl: string;
    followerCount?: number;
}
type MockComment = { id: number; user: CommentUser; text: string; timestamp: string; likes: number; };

const mockComments: MockComment[] = [
    { id: 1, user: { name: 'official_dev197', avatarUrl: 'https://i.pravatar.cc/100?u=dev197', followerCount: 200 }, text: '😂😂😂', timestamp: '19h', likes: 0 },
    { id: 2, user: { name: 'ihassan_07', avatarUrl: 'https://i.pravatar.cc/100?u=hassan07', followerCount: 11000 }, text: '😂', timestamp: '24h', likes: 0 },
    { id: 3, user: { name: 'shakashi_rajput43', avatarUrl: 'https://i.pravatar.cc/100?u=shakashi', followerCount: 500 }, text: '🔥🙌😍', timestamp: '24h', likes: 1 },
    { id: 4, user: { name: 'babita_babyy', avatarUrl: 'https://i.pravatar.cc/100?u=babita', followerCount: 25000 }, text: '❤️😍', timestamp: '24h', likes: 1 },
    { id: 5, user: { name: 'vishal1chouhan12', avatarUrl: 'https://i.pravatar.cc/100?u=vishal', followerCount: 100 }, text: '😂😂😂😂', timestamp: '2h', likes: 0 },
    { id: 6, user: { name: 'yogesh._kabra', avatarUrl: 'https://i.pravatar.cc/100?u=yogesh', followerCount: 9999 }, text: 'Maal bhi Aa gya or paise bhi le liye😂', timestamp: '5h', likes: 1 },
];

const CommentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dragStartY = useRef(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsMounted(true), 10);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
            clearTimeout(timeoutId);
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const mainContentEl = modalRef.current?.querySelector('main');
        if (mainContentEl?.scrollTop === 0) {
            dragStartY.current = e.targetTouches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0) return;
        const currentY = e.targetTouches[0].clientY;
        const deltaY = currentY - dragStartY.current;
        if (deltaY > 0) {
            e.preventDefault();
            if (modalRef.current) {
                modalRef.current.style.transition = 'none';
                modalRef.current.style.transform = `translateY(${deltaY}px)`;
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0 || !modalRef.current) return;
        const deltaY = e.changedTouches[0].clientY - dragStartY.current;
        modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        if (deltaY > 100) {
            handleClose();
        } else {
            modalRef.current.style.transform = 'translateY(0)';
        }
        dragStartY.current = 0;
    };
    
    const modalClasses = `bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-full rounded-t-2xl max-h-[85vh] flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={handleClose}>
            <div
                ref={modalRef}
                className={modalClasses}
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 text-center relative flex-shrink-0">
                    <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-3 absolute top-2 left-1/2 -translate-x-1/2"></div>
                    <h2 className="text-lg font-bold mt-2">Comments</h2>
                    <button className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200" aria-label="Info">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {mockComments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-9 h-9 rounded-full" />
                            <div className="flex-grow">
                                <p className="text-sm">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                        {comment.user.name}
                                        {comment.user.followerCount && comment.user.followerCount >= 10000 && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" /></svg>
                                        )}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 ml-2">{comment.timestamp}</span>
                                </p>
                                <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                                <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Reply</button>
                            </div>
                            <div className="flex flex-col items-center">
                                <button className="text-slate-500 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg></button>
                                {comment.likes > 0 && <span className="text-xs text-slate-500 dark:text-slate-400">{comment.likes}</span>}
                            </div>
                        </div>
                    ))}
                </main>
                <footer className="p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                     <div className="flex items-center space-x-2 py-1 px-2">
                        <img src="https://i.pravatar.cc/100?u=currentuser" alt="Your avatar" className="w-9 h-9 rounded-full" />
                        <input type="text" placeholder="Start the conversation..." className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 dark:text-slate-200" />
                        <button className="text-slate-500 p-1">😊</button>
                        <button className="text-slate-500 p-1">🎁</button>
                     </div>
                </footer>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

const ShareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dragStartY = useRef(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsMounted(true), 10);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
            clearTimeout(timeoutId);
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        dragStartY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0) return;
        const currentY = e.targetTouches[0].clientY;
        const deltaY = currentY - dragStartY.current;
        if (deltaY > 0) {
            e.preventDefault();
            if (modalRef.current) {
                modalRef.current.style.transition = 'none';
                modalRef.current.style.transform = `translateY(${deltaY}px)`;
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0 || !modalRef.current) return;
        const deltaY = e.changedTouches[0].clientY - dragStartY.current;
        modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        if (deltaY > 100) {
            handleClose();
        } else {
            modalRef.current.style.transform = 'translateY(0)';
        }
        dragStartY.current = 0;
    };

    const shareOptions = [
        { label: 'Add to Story', icon: '📖' },
        { label: 'Send in Chat', icon: '💬' },
        { label: 'Copy Link', icon: '🔗' },
        { label: 'Share via...', icon: '🚀' },
    ];
    
    const modalClasses = `bg-white dark:bg-slate-900 w-full rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;

    const modalContent = (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={handleClose}>
            <div 
                ref={modalRef}
                className={modalClasses}
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <header className="p-4 text-center relative">
                    <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3"></div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Share Post</h2>
                </header>
                <main className="p-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {shareOptions.map(opt => (
                            <button key={opt.label} className="flex flex-col items-center space-y-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg">
                                <div className="text-3xl">{opt.icon}</div>
                                <span className="text-xs text-slate-600 dark:text-slate-300">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

const OptionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dragStartY = useRef(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsMounted(true), 10);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
            clearTimeout(timeoutId);
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        dragStartY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0) return;
        const currentY = e.targetTouches[0].clientY;
        const deltaY = currentY - dragStartY.current;
        if (deltaY > 0) {
            e.preventDefault();
            if (modalRef.current) {
                modalRef.current.style.transition = 'none';
                modalRef.current.style.transform = `translateY(${deltaY}px)`;
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0 || !modalRef.current) return;
        const deltaY = e.changedTouches[0].clientY - dragStartY.current;
        modalRef.current.style.transition = 'transform 0.3s ease-in-out';
        if (deltaY > 100) {
            handleClose();
        } else {
            modalRef.current.style.transform = 'translateY(0)';
        }
        dragStartY.current = 0;
    };

    const ListItem: React.FC<{ icon: React.ReactNode; label: string; isDanger?: boolean }> = ({ icon, label, isDanger = false }) => (
        <button className={`w-full flex items-center space-x-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ${isDanger ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
    
    const modalClasses = `bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-full rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={handleClose}>
            <div
                ref={modalRef}
                className={modalClasses}
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <header className="p-4 text-center relative flex-shrink-0">
                    <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div>
                </header>
                <main className="p-4">
                    <div className="space-y-1">
                        <ListItem label="Add to favorites" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
                        <ListItem label="Unfollow" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>} />
                         <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                        <ListItem label="Why you're seeing this post" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        <ListItem label="Hide" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg>} />
                        <ListItem label="About this account" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                        <ListItem label="Report" isDanger={true} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
                    </div>
                </main>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};


// --- MAIN COMPONENT ---

const MainPostCard: React.FC<MainPostCardProps> = ({ post, onPray }) => {
    const { id, name, avatarUrl, request, prayerCount, commentsCount, sharesCount, timestamp, type, imageUrl, videoUrl, followerCount } = post;
    const [isPrayed, setIsPrayed] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentPrayerCount, setCurrentPrayerCount] = useState(prayerCount);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);


    const handlePrayClick = () => {
        if (!isPrayed) {
            onPray(id);
            setIsPrayed(true);
            setCurrentPrayerCount(c => c + 1);
        }
    };

    const handleSaveClick = () => {
        setIsSaved(!isSaved);
    }

    const handleShareClick = async () => {
        const shareData = {
            title: 'A prayer request from FaithConnect',
            text: `Please join in prayer: "${request}"`,
            // The 'url' property is removed as window.location.href can be invalid in this context,
            // causing the "Failed to execute 'share'" error.
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                // AbortError is thrown when the user cancels the share dialog, which is not a real error.
                if ((error as Error).name !== 'AbortError') {
                    console.error('Web Share API error:', error);
                    // Fallback to the custom modal if native share fails for other reasons.
                    setIsShareModalOpen(true);
                }
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            setIsShareModalOpen(true);
        }
    };
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                    <img src={avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                        <div className="flex items-center space-x-1">
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{name}</p>
                            {followerCount && followerCount >= 10000 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" /></svg>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(timestamp)}</p>
                    </div>
                </div>
                <button onClick={() => setIsOptionsModalOpen(true)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 -mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
            </div>

            {/* Post Content: Text or Media */}
            {type === 'text' && (
                 <p className="px-3 pb-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{request}</p>
            )}
            {type === 'image' && imageUrl && (
                <img src={imageUrl} alt="Prayer post" className="w-full h-auto max-h-[70vh] object-cover border-y border-slate-200 dark:border-slate-700" />
            )}
            {type === 'video' && videoUrl && (
                <video src={videoUrl} controls className="w-full h-auto max-h-[70vh] bg-black" />
            )}

            {/* Actions & Caption */}
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handlePrayClick} 
                            className={`flex items-center space-x-1 transition-colors ${isPrayed ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5v2.5m10-2.5v2.5m-10-5c-1.5 1.5-2.5 4-2.5 6s1 4.5 2.5 6m10-12c1.5 1.5 2.5 4 2.5 6s-1 4.5-2.5 6M12 5.5v13" />
                            </svg>
                            <span className="text-sm font-medium">{currentPrayerCount.toLocaleString()}</span>
                        </button>
                        <button onClick={() => setIsCommentModalOpen(true)} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                             <span className="text-sm font-medium">{commentsCount.toLocaleString()}</span>
                        </button>
                         <button onClick={handleShareClick} className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                             <span className="text-sm font-medium">{sharesCount.toLocaleString()}</span>
                        </button>
                    </div>
                     <button onClick={handleSaveClick} className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 p-2 -mr-2">
                        {isSaved ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        )}
                    </button>
                </div>
                
                 {type !== 'text' && request && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap"><span className="font-semibold text-slate-800 dark:text-slate-200">{name}</span> {request}</p>
                 )}

                 <button onClick={() => setIsCommentModalOpen(true)} className="text-sm text-slate-500 dark:text-slate-400 mt-1">View all {commentsCount} comments</button>
            </div>

            {isCommentModalOpen && <CommentModal onClose={() => setIsCommentModalOpen(false)} />}
            {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
            {isOptionsModalOpen && <OptionsModal onClose={() => setIsOptionsModalOpen(false)} />}
        </div>
    );
};

export default MainPostCard;