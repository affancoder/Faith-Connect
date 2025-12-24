import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Story, StoryItem, User } from '../types';

interface ViewStoryScreenProps {
    story: Story;
    onClose: () => void;
    onNextStory: () => void;
    onPrevStory: () => void;
    onOpenUserProfile: (user: User) => void;
}

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
};

const ViewStoryScreen: React.FC<ViewStoryScreenProps> = ({ story, onClose, onNextStory, onPrevStory, onOpenUserProfile }) => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const timerRef = useRef<number | null>(null);
    const progressRef = useRef<number>(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const activeItem = story.items[activeItemIndex];

    const goToNextItem = useCallback(() => {
        if (activeItemIndex < story.items.length - 1) {
            setActiveItemIndex(i => i + 1);
        } else {
            onNextStory();
        }
    }, [activeItemIndex, story.items.length, onNextStory]);

    const goToPrevItem = useCallback(() => {
        if (activeItemIndex > 0) {
            setActiveItemIndex(i => i - 1);
        } else {
            onPrevStory();
        }
    }, [activeItemIndex, onPrevStory]);
    
    useEffect(() => {
        // Reset to the first item when the story object changes
        setActiveItemIndex(0);
    }, [story]);

    useEffect(() => {
        setProgress(0);
        if (timerRef.current) clearInterval(timerRef.current);
        const videoEl = videoRef.current;

        if (activeItem.type === 'image') {
            progressRef.current = 0;
            const tick = () => {
                if (!isPaused) {
                    progressRef.current += 100 / (activeItem.duration * 10);
                    setProgress(progressRef.current);
                    if (progressRef.current >= 100) {
                        goToNextItem();
                    }
                }
            };
            timerRef.current = window.setInterval(tick, 100);
        } else if (activeItem.type === 'video' && videoEl) {
            const handleTimeUpdate = () => {
                if (videoEl.duration > 0) {
                    setProgress((videoEl.currentTime / videoEl.duration) * 100);
                }
            };
            const handleVideoEnd = () => goToNextItem();
            
            videoEl.addEventListener('timeupdate', handleTimeUpdate);
            videoEl.addEventListener('ended', handleVideoEnd);
            
            videoEl.currentTime = 0;
            if (isPaused) {
                videoEl.pause();
            } else {
                const playPromise = videoEl.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // The AbortError is thrown when the user navigates away before playback starts.
                        // We can safely ignore it.
                        if (error.name !== 'AbortError') {
                            console.error("Error playing video:", error);
                        }
                    });
                }
            }

            return () => {
                videoEl.removeEventListener('timeupdate', handleTimeUpdate);
                videoEl.removeEventListener('ended', handleVideoEnd);
                // Pause the video in cleanup to prevent "play() interrupted" errors
                if (!videoEl.paused) {
                    videoEl.pause();
                }
            };
        }
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeItem, activeItemIndex, isPaused, goToNextItem]);

    // This separate effect handles pausing/playing the video when the user interacts
    useEffect(() => {
        const videoEl = videoRef.current;
        if (activeItem.type === 'video' && videoEl) {
            if (isPaused) {
                videoEl.pause();
            } else {
                videoEl.play().catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error("Error resuming video:", error);
                    }
                });
            }
        }
    }, [isPaused, activeItem]);

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        const tapPosition = clientX - left;
        if (tapPosition < width * 0.3) {
            goToPrevItem();
        } else {
            goToNextItem();
        }
    };

    const handlePointerDown = () => setIsPaused(true);
    const handlePointerUp = () => setIsPaused(false);
    
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenUserProfile(story.user);
    };

    return (
        <div 
            className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none"
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
        >
            <div className="relative w-full h-full max-w-md max-h-[100dvh] aspect-[9/16] overflow-hidden rounded-lg">
                {/* Media */}
                {activeItem.type === 'image' ? (
                    <img src={activeItem.url} alt="story content" className="w-full h-full object-cover" />
                ) : (
                    <video key={activeItem.id} ref={videoRef} src={activeItem.url} playsInline className="w-full h-full object-cover" />
                )}

                {/* Overlay UI */}
                <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

                    {/* Progress Bars */}
                    <div className="absolute top-2 left-2 right-2 flex space-x-1">
                        {story.items.map((_, index) => (
                            <div key={index} className="flex-1 h-1 bg-white/40 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white" 
                                    style={{ width: `${index < activeItemIndex ? 100 : (index === activeItemIndex ? progress : 0)}%`, transition: index === activeItemIndex && progress > 0 ? 'width 0.1s linear' : 'none' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-5 left-4 right-4 flex items-center justify-between pointer-events-auto">
                        <button onClick={handleProfileClick} className="flex items-center space-x-3 group">
                            <img src={story.user.avatarUrl} alt={story.user.name} className="w-9 h-9 rounded-full" />
                            <div className="flex items-center space-x-1">
                                <p className="text-white font-bold text-sm group-hover:underline">{story.user.name}</p>
                                {story.user.followerCount && story.user.followerCount >= 10000 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" /></svg>
                                )}
                            </div>
                            <p className="text-white/80 text-sm">{timeAgo(story.timestamp)}</p>
                        </button>
                        <button onClick={onClose} className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    {/* Reply bar */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-3 pointer-events-auto">
                        <input type="text" placeholder={`Reply to ${story.user.name}...`} className="w-full bg-black/30 border border-white/40 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50" onClick={e => e.stopPropagation()} />
                        <button className="text-white" aria-label="Send">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>

                {/* Navigation areas */}
                <div className="absolute inset-0 flex" onClick={handleTap}>
                    <div className="w-1/3 h-full"></div>
                    <div className="w-2/3 h-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ViewStoryScreen;