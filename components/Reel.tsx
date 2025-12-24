import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Reel as ReelType } from '../types';

interface ReelProps {
    reel: ReelType;
    onOpenUserProfile: (user: ReelType['user']) => void;
    following: Set<string>;
    onFollow: (userId: string) => void;
}

// --- MODAL COMPONENTS (Dark Theme for Reels) ---

const mockReelComments = [
  { id: 1, user: { name: 'official_dev197', avatarUrl: 'https://i.pravatar.cc/100?u=dev197' }, text: 'This is powerful! 🙏', timestamp: '1h' },
  { id: 2, user: { name: 'ihassan_07', avatarUrl: 'https://i.pravatar.cc/100?u=hassan07' }, text: 'Amen to that!', timestamp: '2h' },
  { id: 3, user: { name: 'sarahlikes', avatarUrl: 'https://i.pravatar.cc/100?u=sarah' }, text: 'Needed to hear this today.', timestamp: '2h', likes: 5 },
  { id: 4, user: { name: 'mikeb', avatarUrl: 'https://i.pravatar.cc/100?u=michael' }, text: 'Incredible message.', timestamp: '3h', likes: 2 },
];


const CaptionModal: React.FC<{ caption: string; user: ReelType['user']; onClose: () => void; }> = ({ caption, user, onClose }) => (
    createPortal(
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 text-white p-6 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex items-center space-x-3 mb-4">
                    <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                    <p className="font-bold">{user.name}</p>
                </div>
                <p className="whitespace-pre-wrap">{caption}</p>
            </div>
        </div>,
        document.body
    )
);

const CommentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dragStartY = useRef(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsMounted(true), 10);
        document.body.style.overflow = 'hidden';
        return () => { clearTimeout(timeoutId); document.body.style.overflow = ''; };
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const mainContentEl = modalRef.current?.querySelector('main');
        if (mainContentEl?.scrollTop === 0) dragStartY.current = e.targetTouches[0].clientY;
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (dragStartY.current === 0) return;
        const deltaY = e.targetTouches[0].clientY - dragStartY.current;
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
        if (deltaY > 100) handleClose(); else modalRef.current.style.transform = 'translateY(0)';
        dragStartY.current = 0;
    };
    
    const modalClasses = `bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-full rounded-t-2xl max-h-[85vh] flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={handleClose}>
            <div ref={modalRef} className={modalClasses} onClick={e => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 text-center relative flex-shrink-0">
                    <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-3 absolute top-2 left-1/2 -translate-x-1/2"></div>
                    <h2 className="text-lg font-bold mt-2">Comments</h2>
                </header>
                <main className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {mockReelComments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-9 h-9 rounded-full" />
                            <div className="flex-grow">
                                <p className="text-sm"><span className="font-bold text-slate-800 dark:text-slate-200">{comment.user.name}</span><span className="text-slate-500 dark:text-slate-400 ml-2">{comment.timestamp}</span></p>
                                <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                                <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Reply</button>
                            </div>
                            <div className="flex flex-col items-center"><button className="text-slate-500 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg></button>{comment.likes && comment.likes > 0 && <span className="text-xs text-slate-500 dark:text-slate-400">{comment.likes}</span>}</div>
                        </div>
                    ))}
                </main>
                <footer className="p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0"><div className="flex items-center space-x-2 py-1 px-2"><img src="https://i.pravatar.cc/100?u=currentuser" alt="Your avatar" className="w-9 h-9 rounded-full" /><input type="text" placeholder="Add a comment..." className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-200" /></div></footer>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

const ShareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => { setTimeout(() => setIsMounted(true), 10); document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
    const handleClose = useCallback(() => { setIsClosing(true); setTimeout(onClose, 300); }, [onClose]);
    const modalClasses = `bg-slate-900 text-white w-full rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;
    const modalContent = (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={handleClose}>
            <div ref={modalRef} className={modalClasses} onClick={e => e.stopPropagation()}>
                <header className="p-4 text-center relative"><div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto mb-3"></div><h2 className="text-lg font-bold">Share Reel</h2></header>
                <main className="p-4"><div className="grid grid-cols-4 gap-4 text-center">
                    {[{ label: 'Copy Link', icon: '🔗' }, { label: 'SMS', icon: '💬' }, { label: 'WhatsApp', icon: '🟢' }, { label: 'More', icon: '🚀' }].map(opt => (
                        <button key={opt.label} className="flex flex-col items-center space-y-2 hover:bg-slate-800 p-2 rounded-lg"><div className="text-3xl">{opt.icon}</div><span className="text-xs text-slate-300">{opt.label}</span></button>
                    ))}
                </div></main>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

const OptionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => { setTimeout(() => setIsMounted(true), 10); document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
    const handleClose = useCallback(() => { setIsClosing(true); setTimeout(onClose, 300); }, [onClose]);
    const ListItem: React.FC<{ icon: React.ReactNode; label: string; isDanger?: boolean }> = ({ icon, label, isDanger = false }) => (
        <button className={`w-full flex items-center space-x-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ${isDanger ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>{icon}<span className="font-medium">{label}</span></button>
    );
    const modalClasses = `bg-white dark:bg-slate-900 text-slate-800 w-full rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMounted && !isClosing ? 'translate-y-0' : 'translate-y-full'}`;
    const modalContent = (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={handleClose}>
            <div ref={modalRef} className={modalClasses} onClick={e => e.stopPropagation()}>
                <header className="p-4 text-center relative flex-shrink-0"><div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div></header>
                <main className="p-4"><div className="space-y-1">
                    <ListItem label="Save" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>} />
                    <ListItem label="Not interested" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
                    <ListItem label="Report" isDanger={true} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
                </div></main>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

// --- MAIN COMPONENT ---

const Reel: React.FC<ReelProps> = ({ reel, onOpenUserProfile, following, onFollow }) => {
    const { videoUrl, user, caption, comments, shares } = reel;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reel.likes);

    const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    
    const isFollowing = following.has(user.id);

    const handleContainerClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            setIsMuted(false);
            if (video.paused) video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
            if (video.paused) video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            else { video.pause(); setIsPlaying(false); }
        }
    };
    
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                videoElement.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
                videoElement.pause(); setIsPlaying(false);
            }
        }, { threshold: 0.5 });
        observer.observe(videoElement);
        return () => { if (videoElement) observer.unobserve(videoElement); };
    }, []);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShareClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = { title: `Reel by ${user.name} on FaithConnect`, text: caption };
        if (navigator.share) {
            try { await navigator.share(shareData); } 
            catch (error) { if ((error as Error).name !== 'AbortError') setIsShareModalOpen(true); }
        } else { setIsShareModalOpen(true); }
    };

    const handleProfileClick = (e: React.MouseEvent) => { e.stopPropagation(); onOpenUserProfile(user); };
    const handleFollowClick = (e: React.MouseEvent) => { e.stopPropagation(); onFollow(user.id); };

    return (
        <>
            <section className="relative h-full w-full snap-start flex-shrink-0" onClick={handleContainerClick}>
                <video ref={videoRef} src={videoUrl} loop playsInline muted={isMuted} className="w-full h-full object-contain" />
                {!isPlaying && (<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.134v3.732a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664l-3.197-2.132z" clipRule="evenodd" /></svg></div>)}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                
                <div className="absolute bottom-2 left-0 right-0 text-white z-10 p-4 flex items-end justify-between">
                    <div className="flex-1 pr-4 space-y-2 max-w-[calc(100%-6rem)]">
                        <div className="flex items-center space-x-2 pointer-events-auto">
                            <button onClick={handleProfileClick} className="flex items-center space-x-2">
                                <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full border-2 border-white" />
                                <div className="flex items-center space-x-1">
                                    <p className="font-bold text-sm drop-shadow-md">{user.name}</p>
                                    {user.followerCount && user.followerCount >= 10000 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" /></svg>
                                    )}
                                </div>
                            </button>
                            <button onClick={handleFollowClick} className={`text-sm font-semibold border px-3 py-0.5 rounded-md transition-colors ${isFollowing ? 'bg-white/20 text-white border-white/50' : 'bg-white text-black border-transparent'}`}>{isFollowing ? 'Following' : 'Follow'}</button>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setIsCaptionExpanded(true); }} className="text-sm drop-shadow-md truncate text-left pointer-events-auto">{caption}</button>
                        <div className="flex items-center space-x-2 pointer-events-auto cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 16.22a2.25 2.25 0 01-1.07-1.916V9.61a2.25 2.25 0 011.07-1.916l7.5-4.615a2.25 2.25 0 012.36 0L19.5 7.72a2.25 2.25 0 011.07 1.916" /></svg><p className="text-xs font-medium truncate">Original Audio - {user.name}</p></div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 pointer-events-auto">
                        <button onClick={handleLike} className="flex flex-col items-center text-center focus:outline-none">{isLiked ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>)}<span className="text-xs font-semibold mt-1 drop-shadow-md">{likeCount.toLocaleString()}</span></button>
                        <button onClick={(e) => { e.stopPropagation(); setIsCommentModalOpen(true); }} className="flex flex-col items-center text-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l3.652-3.978A2.25 2.25 0 0117.75 16.279c1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg><span className="text-xs font-semibold mt-1 drop-shadow-md">{comments.toLocaleString()}</span></button>
                        <button onClick={handleShareClick} className="flex flex-col items-center text-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg><span className="text-xs font-semibold mt-1 drop-shadow-md">{shares.toLocaleString()}</span></button>
                        <button onClick={(e) => { e.stopPropagation(); setIsOptionsModalOpen(true); }} className="flex flex-col items-center text-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></button>
                        <button onClick={handleProfileClick} className="mt-2"><img src={user.avatarUrl} alt="audio source" className="h-8 w-8 rounded-md border-2 border-slate-400" /></button>
                    </div>
                </div>
            </section>

            {isCaptionExpanded && <CaptionModal caption={caption} user={user} onClose={() => setIsCaptionExpanded(false)} />}
            {isCommentModalOpen && <CommentModal onClose={() => setIsCommentModalOpen(false)} />}
            {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
            {isOptionsModalOpen && <OptionsModal onClose={() => setIsOptionsModalOpen(false)} />}
        </>
    );
};

export default Reel;