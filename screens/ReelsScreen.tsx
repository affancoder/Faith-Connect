import React, { useState, useEffect, useCallback } from 'react';
import { Reel as ReelType, User } from '../types';
import Reel from '../components/Reel';
import PullToRefresh from '../components/PullToRefresh';

const reelsData: ReelType[] = [
    {
        id: '1',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        user: { id: 'bhawna', name: 'bhawna_gera02', avatarUrl: 'https://i.pravatar.cc/100?u=grace', followerCount: 890 },
        caption: 'Men ✔️ boy ❌.. YES she is absolutely correct ...',
        likes: 962,
        comments: 1802,
        shares: 88,
    },
    {
        id: '2',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        user: { id: 'samuel', name: 'Samuel K.', avatarUrl: 'https://i.pravatar.cc/100?u=samuel', followerCount: 12501 },
        caption: 'My testimony from this week\'s mission trip. We saw incredible things!',
        likes: 2501,
        comments: 340,
        shares: 121,
    },
    {
        id: '3',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        user: { id: 'hope', name: 'Hope Community', avatarUrl: 'https://i.pravatar.cc/100?u=hope', followerCount: 52340 },
        caption: 'A recap of our youth group event this past weekend. So much joy!',
        likes: 890,
        comments: 95,
        shares: 45,
    }
];

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
);

const friendsAvatars = [
    'https://i.pravatar.cc/100?u=friend1',
    'https://i.pravatar.cc/100?u=friend2',
    'https://i.pravatar.cc/100?u=friend3',
];

const ReelsHeader: React.FC = () => (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none">
        <div className="flex items-center justify-center text-white relative">
            <div className="flex items-center space-x-6 text-lg pointer-events-auto">
                <button className="font-normal text-gray-300 flex items-center space-x-2">
                    <span>Friends</span>
                    <div className="flex -space-x-2">
                        {friendsAvatars.map((src, i) => (
                            <img key={i} src={src} alt={`friend ${i+1}`} className="w-5 h-5 rounded-full border-2 border-black" />
                        ))}
                    </div>
                </button>
            </div>
        </div>
    </header>
);

interface ReelsScreenProps {
    onOpenUserProfile: (user: User) => void;
    following: Set<string>;
    onFollow: (userId: string) => void;
}

const ReelsScreen: React.FC<ReelsScreenProps> = ({ onOpenUserProfile, following, onFollow }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [reels, setReels] = useState<ReelType[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setReels(reelsData);
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    
    const handleRefresh = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        // To simulate new reels, we'll just re-order them
        setReels(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    if (isLoading) {
        return (
             <div className="relative h-full w-full bg-black flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-black">
            <ReelsHeader />
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
                    {reels.map(reel => (
                        <Reel 
                            key={reel.id} 
                            reel={reel} 
                            onOpenUserProfile={onOpenUserProfile}
                            following={following}
                            onFollow={onFollow}
                        />
                    ))}
                </div>
            </PullToRefresh>
        </div>
    );
};

export default ReelsScreen;