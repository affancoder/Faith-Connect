import React, { useMemo } from 'react';
import { Story, User, StoryItem } from '../types';

interface StoryCirclesProps {
    onViewStory: (story: Story, allStories: Story[]) => void;
    onOpenCreateStory: () => void;
    following: Set<string>;
    viewedStories: Set<string>;
}

const currentUser: User = {
    id: 'currentuser',
    name: 'Jane Doe',
    avatarUrl: 'https://i.pravatar.cc/100?u=currentuser'
};

const mockUsers: User[] = [
    { id: 'grace', name: 'Grace P.', avatarUrl: 'https://i.pravatar.cc/100?u=grace' },
    { id: 'samuel', name: 'Samuel K.', avatarUrl: 'https://i.pravatar.cc/100?u=samuel' },
    { id: 'hope', name: 'Hope Community', avatarUrl: 'https://i.pravatar.cc/100?u=hope' },
    { id: 'david', name: 'David R.', avatarUrl: 'https://i.pravatar.cc/100?u=david' },
    { id: 'sarah', name: 'Sarah L.', avatarUrl: 'https://i.pravatar.cc/100?u=sarah' },
    { id: 'kenji', name: 'Kenji T.', avatarUrl: 'https://i.pravatar.cc/100?u=kenji' },
    { id: 'pastor', name: 'Pastor Samuel', avatarUrl: 'https://i.pravatar.cc/100?u=pastor' },
    { id: 'anya', name: 'Anya P.', avatarUrl: 'https://i.pravatar.cc/100?u=anya' },
];

const mockStoryItems: StoryItem[] = [
    { id: 's1i1', url: 'https://images.unsplash.com/photo-1534008757038-2cb3b27b93e2?q=80&w=800&auto=format&fit=crop', type: 'image', duration: 30 },
    { id: 's1i2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', type: 'video', duration: 15 },
    { id: 's2i1', url: 'https://images.unsplash.com/photo-1604145706342-8d1a1b399a2a?q=80&w=800&auto=format&fit=crop', type: 'image', duration: 30 },
];


const mockStories: Story[] = mockUsers.map((user, index) => ({
    id: `s${index + 1}`,
    user,
    items: [mockStoryItems[index % mockStoryItems.length]],
    timestamp: new Date(Date.now() - 3600000 * (index * 4)), // 0h, 4h, 8h, 12h, 16h, 20h, 24h, 28h ago
}));


const StoryCircle: React.FC<{ user: User, hasStory?: boolean, isCurrentUser?: boolean, onClick: () => void, isViewed?: boolean }> = ({ user, hasStory = false, isCurrentUser = false, onClick, isViewed = false }) => (
    <div className="flex flex-col items-center space-y-1 flex-shrink-0" onClick={onClick}>
        <div className={`relative rounded-full p-0.5 ${hasStory ? (isViewed ? 'bg-slate-300 dark:bg-slate-700' : 'bg-gradient-to-tr from-yellow-400 to-red-500') : ''}`}>
            <div className="bg-white dark:bg-slate-900 p-0.5 rounded-full">
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
            </div>
            {isCurrentUser && !hasStory && (
                 <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                </div>
            )}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 w-20 text-center truncate">{isCurrentUser ? "Your Story" : user.name}</p>
    </div>
);

const StoryCircles: React.FC<StoryCirclesProps> = ({ onViewStory, onOpenCreateStory, following, viewedStories }) => {
    const filteredStories = useMemo(() => {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // Filter stories from followed users that are not older than 24 hours.
        return mockStories.filter(story => 
            (following.has(story.user.id) || story.user.id === currentUser.id) && 
            story.timestamp > twentyFourHoursAgo
        );
    }, [following]);
    
    // Sort stories to show unviewed ones first, moving viewed ones to the end.
    const sortedStories = useMemo(() => {
        return [...filteredStories].sort((a, b) => {
            const aIsViewed = viewedStories.has(a.id);
            const bIsViewed = viewedStories.has(b.id);

            if (aIsViewed === bIsViewed) {
                return 0; // Keep original order if both are in the same viewed state
            }
            
            return aIsViewed ? 1 : -1; // Unviewed (false) comes first
        });
    }, [filteredStories, viewedStories]);

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="flex space-x-4 p-3 overflow-x-auto scrollbar-hide">
                <StoryCircle user={currentUser} isCurrentUser={true} onClick={onOpenCreateStory} />
                {sortedStories.map(story => {
                    const isViewed = viewedStories.has(story.id);
                    return (
                        <StoryCircle 
                            key={story.id} 
                            user={story.user} 
                            hasStory={true} 
                            onClick={() => onViewStory(story, sortedStories)}
                            isViewed={isViewed}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default StoryCircles;